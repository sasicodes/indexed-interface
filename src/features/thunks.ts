import * as topLevelActions from "./actions";
import { AppThunk } from "./store";
import { BigNumber } from "bignumber.js";
import { CoinGeckoService } from "services";
import { SLIPPAGE_RATE, SUBGRAPH_URL_UNISWAP } from "config";
import { batcherActions } from "./batcher";
import { categoriesActions } from "./categories";
import { convert } from "helpers";
import { helpers } from "ethereum";
import { indexPoolsActions } from "./indexPools";
import { providers } from "ethers";
import { settingsActions } from "./settings";
import { tokensActions } from "./tokens";
import { userActions } from "./user";
import debounce from "lodash.debounce";
import selectors from "./selectors";

export let provider:
  | null
  | providers.Web3Provider
  | providers.JsonRpcProvider
  | providers.InfuraProvider = null;
export let signer: null | providers.JsonRpcSigner = null;

type InitialzeOptions = {
  provider:
    | providers.Web3Provider
    | providers.JsonRpcProvider
    | providers.InfuraProvider;
  withSigner?: boolean;
  selectedAddress?: string;
};

/**
 * Since the handler can fire multiple times in quick succession,
 * we need to batch the calls to avoid unnecessary updates.
 */
const BLOCK_HANDLER_DEBOUNCE_RATE = 250;

const thunks = {
  /**
   *
   */
  initialize: (options: InitialzeOptions): AppThunk => async (
    dispatch,
    getState
  ) => {
    let selectedAddress = "";

    provider = options.provider;

    if (options.withSigner) {
      signer = provider.getSigner();

      if (options.selectedAddress) {
        selectedAddress = options.selectedAddress;
      } else if (provider.connection.url === "metamask") {
        selectedAddress = (provider as any).provider.selectedAddress;
      } else {
        throw new Error("Unable to initialize without a selected address.");
      }
    }

    await provider.ready;

    dispatch(thunks.retrieveInitialData());

    if (selectedAddress) {
      dispatch(actions.userAddressSelected(selectedAddress));
    }

    /**
     * When the block number changes,
     * change the state so that batcher may process.
     */
    const debouncedBlockHandler = debounce((blockNumber) => {
      const blockNumberAtThisTime = selectors.selectBlockNumber(getState());

      if (blockNumber !== blockNumberAtThisTime) {
        dispatch(thunks.changeBlockNumber(blockNumber));
      }
    }, BLOCK_HANDLER_DEBOUNCE_RATE);

    provider.addListener("block", debouncedBlockHandler);
  },
  /**
   *
   */
  changeBlockNumber: (blockNumber: number): AppThunk => async (
    dispatch,
    getState
  ) => {
    dispatch(actions.blockNumberChanged(blockNumber));
    dispatch(thunks.sendBatch());
  },
  /**
   *
   */
  retrieveInitialData: (): AppThunk => async (dispatch) => {
    if (provider) {
      const { chainId } = provider.network;
      const url = helpers.getUrl(chainId);
      const initial = await helpers.queryInitial(url);
      const formatted = helpers.normalizeInitialData(initial);

      dispatch(actions.subgraphDataLoaded(formatted));
    }
  },
  /**
   *
   */
  retrieveCoingeckoIds: (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const tokenDictionary = selectors
      .selectTokenSymbols(state)
      .reduce((prev, next) => {
        prev[next.toLowerCase()] = true;
        return prev;
      }, {} as Record<string, true>);
    const allSupportedCoins = await CoinGeckoService.getSupportedTokens();
    const relevantSupportedCoins = allSupportedCoins.filter(
      (coin: any) => tokenDictionary[coin.symbol.toLowerCase()]
    );
    const supportedCoinIds = relevantSupportedCoins.map(
      ({ id, symbol }: any) => ({
        id,
        symbol,
      })
    );

    dispatch(actions.coingeckoIdsLoaded(supportedCoinIds));
  },
  /**
   *
   */
  retrieveCoingeckoData: (poolId: string): AppThunk => async (
    dispatch,
    getState
  ) => {
    const state = getState();
    const tokenIds = selectors.selectPoolTokenIds(state, poolId);
    const tokenLookup = selectors.selectTokenLookup(state);
    const relevantTokenAddresses = tokenIds.filter((id) => tokenLookup[id]);
    const coingeckoData = await CoinGeckoService.getStatsForTokens(
      relevantTokenAddresses
    );

    dispatch(actions.coingeckoDataLoaded(coingeckoData));
  },
  poolUpdateListenerRegistered: (poolId: string): AppThunk => (
    dispatch,
    getState
  ) => {
    const state = getState();
    const tokens = selectors.selectPoolUnderlyingTokens(state, poolId);

    return dispatch(
      actions.listenerRegistered({
        id: "",
        kind: "PoolData",
        pool: poolId,
        args: tokens,
      })
    );
  },
  tokenUserDataListenerRegistered: (poolId: string): AppThunk => (
    dispatch,
    getState
  ) => {
    const state = getState();
    const tokens = selectors.selectPoolUnderlyingTokens(state, poolId);

    return dispatch(
      actions.listenerRegistered({
        id: "",
        kind: "TokenUserData",
        pool: poolId,
        args: tokens,
      })
    );
  },
  requestPoolTradesAndSwaps: (poolId: string): AppThunk => async (dispatch) => {
    if (provider) {
      const { chainId } = await provider.getNetwork();
      const url = helpers.getUrl(chainId);
      const [trades, swaps] = await Promise.all([
        helpers.queryTrades(SUBGRAPH_URL_UNISWAP, poolId),
        helpers.querySwaps(url, poolId),
      ]);

      dispatch(actions.poolTradesAndSwapsLoaded({ poolId, trades, swaps }));
    }
  },
  /**
   *
   */
  approvePool: (
    poolAddress: string,
    tokenSymbol: string,
    amount: string
  ): AppThunk => async (_, getState) => {
    const state = getState();
    const tokensBySymbol = selectors.selectTokenLookupBySymbol(state);
    const tokenAddress = tokensBySymbol[tokenSymbol]?.id ?? "";

    if (signer && tokenAddress) {
      try {
        await helpers.approvePool(signer, poolAddress, tokenAddress, amount);
      } catch {
        // Handle failed approval.
      }
    }
  },
  /**
   *
   */
  swap: (
    poolAddress: string,
    specifiedSide: "input" | "output",
    inputAmount: string,
    inputTokenSymbol: string,
    outputAmount: string,
    outputTokenSymbol: string,
    maximumPrice: BigNumber
  ): AppThunk => async (_, getState) => {
    if (signer) {
      const state = getState();
      const tokensBySymbol = selectors.selectTokenLookupBySymbol(state);
      
      let [input, output] = [inputAmount, outputAmount].map(convert.toToken);
      if (specifiedSide === "input") {
        output = helpers.downwardSlippage(output, SLIPPAGE_RATE);
      } else {
        input = helpers.upwardSlippage(input, SLIPPAGE_RATE);
      }
      const { id: inputAddress } = tokensBySymbol[inputTokenSymbol];
      const { id: outputAddress } = tokensBySymbol[outputTokenSymbol];

      if (inputAddress && outputAddress) {
        if (specifiedSide === "input") {
          await helpers.swapExactAmountIn(
            signer,
            poolAddress,
            inputAddress,
            outputAddress,
            input,
            output,
            maximumPrice
          );
        } else {
          await helpers.swapExactAmountOut(
            signer,
            poolAddress,
            inputAddress,
            outputAddress,
            input,
            output,
            maximumPrice
          );
        }
      } else {
        // --
      }
    }
  },
  sendBatch: (): AppThunk => async (dispatch, getState) => {
    if (provider) {
      const state = getState();
      const batch = selectors.selectBatch(state);
      const sourceAddress = selectors.selectUserAddress(state);

      for (const task of batch.poolDataTasks) {
        const pool = selectors.selectPool(state, task.pool);

        if (pool) {
          const update = await helpers.poolUpdateMulticall(
            provider,
            pool.id,
            task.args
          );

          dispatch(actions.poolUpdated({ pool, update }));
          dispatch(actions.retrieveCoingeckoData(pool.id));
          dispatch(actions.requestPoolTradesAndSwaps(pool.id));
        }
      }

      for (const task of batch.tokenUserDataTasks) {
        const pool = selectors.selectPool(state, task.pool);
        const destinationAddress = task.pool;

        if (pool) {
          const {
            blockNumber,
            data: userData,
          } = await helpers.tokenUserDataMulticall(
            provider,
            sourceAddress,
            destinationAddress,
            task.args
          );

          dispatch(
            actions.poolUserDataLoaded({
              blockNumber: +blockNumber,
              poolId: pool.id,
              userData,
            })
          );
        }
      }
    }
  },
};

const actions = {
  ...batcherActions,
  ...categoriesActions,
  ...indexPoolsActions,
  ...settingsActions,
  ...tokensActions,
  ...userActions,
  ...topLevelActions,
  ...thunks,
};

export default actions;
