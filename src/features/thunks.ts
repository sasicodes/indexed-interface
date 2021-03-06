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
import { sleep } from "helpers";
import { tokensActions } from "./tokens";
import selectors from "./selectors";

export let provider:
  | null
  | providers.Web3Provider
  | providers.JsonRpcProvider
  | providers.InfuraProvider = null;
export let signer: null | providers.JsonRpcSigner = null;
export let selectedAddress: string;

type InitialzeOptions = {
  provider:
    | providers.Web3Provider
    | providers.JsonRpcProvider
    | providers.InfuraProvider;
  withSigner?: boolean;
  selectedAddress?: string;
};

const thunks = {
  /**
   *
   */
  initialize: (options: InitialzeOptions): AppThunk => async (
    dispatch,
    getState
  ) => {
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

    /**
     * When the block number changes,
     * change the state so that batcher may process.
     */
    provider.addListener("block", (blockNumber) => {
      const blockNumberAtThisTime = selectors.selectBlockNumber(getState());

      if (blockNumber !== blockNumberAtThisTime) {
        dispatch(actions.blockNumberChanged(blockNumber));
      }
    });
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
  /**
   *
   */
  requestPoolUpdate: (poolId: string): AppThunk => async (
    dispatch,
    getState
  ) => {
    const state = getState();
    const pool = selectors.selectPool(state, poolId);
    const tokens = selectors.selectPoolUnderlyingTokens(state, poolId);

    if (provider && pool) {
      const update = await helpers.poolUpdateMulticall(
        provider,
        poolId,
        tokens
      );

      dispatch(
        actions.poolUpdated({
          pool,
          update,
        })
      );
    }
  },
  /**
   *
   */
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
   * @param poolId -
   */
  requestPoolUserData: (poolId: string): AppThunk => async (
    dispatch,
    getState
  ) => {
    if (provider) {
      const state = getState();
      const sourceAddress = selectedAddress;
      const destinationAddress = poolId;
      const tokens = selectors.selectPoolUnderlyingTokens(state, poolId);

      if (sourceAddress && destinationAddress) {
        const userData = await helpers.tokenUserDataMulticall(
          provider,
          sourceAddress,
          destinationAddress,
          tokens
        );

        dispatch(
          actions.poolUserDataLoaded({
            poolId,
            userData,
          })
        );
      }
    } else {
      await sleep(500);

      dispatch(thunks.requestPoolUserData(poolId));
    }
  },
  /**
   *
   */
  requestPoolDetail: (poolId: string, includeCalls = true): AppThunk => async (
    dispatch
  ) => {
    dispatch(actions.retrieveCoingeckoData(poolId));
    dispatch(actions.requestPoolTradesAndSwaps(poolId));
    dispatch(actions.requestPoolUpdate(poolId));

    if (includeCalls) {
      dispatch(actions.requestPoolUserData(poolId));
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
      const slippageFunction =
        specifiedSide === "input"
          ? helpers.downwardSlippage
          : helpers.upwardSlippage;
      const minimumAmount = slippageFunction(
        convert.toToken(outputAmount),
        SLIPPAGE_RATE
      );
      const [input, output] = [inputAmount, outputAmount].map((which) =>
        convert.toHex(convert.toToken(which.toString()))
      );
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
            minimumAmount,
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
};

const actions = {
  ...batcherActions,
  ...categoriesActions,
  ...indexPoolsActions,
  ...settingsActions,
  ...tokensActions,
  ...topLevelActions,
  ...thunks,
};

export default actions;
