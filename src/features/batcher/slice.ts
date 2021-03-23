import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { abiLookup } from "ethereum/abi";
import {
  coingeckoDataLoaded,
  multicallDataReceived,
  poolTradesAndSwapsLoaded,
} from "features/actions";
import { stakingActions } from "../staking";
import { userActions } from "../user";
import type { AppState, AppThunk } from "features/store";
import type { Call } from "ethereum";
import type { InterfaceKind } from "ethereum/abi";
import type { NdxStakingPool } from "indexed-types";

export type RegisteredCall = {
  interfaceKind?: InterfaceKind;
  target: string;
  function: string;
  args?: string[];
};

export type CallWithResult = Omit<Call, "interface" | "args"> & {
  result: string[];
  args?: string[];
};

interface BatcherState {
  blockNumber: number;
  onChainCalls: string[];
  offChainCalls: string[];
  cache: Record<
    string,
    {
      result: string[];
      fromBlockNumber: number;
    }
  >;
  listenerCounts: Record<string, number>;
}

const MAX_AGE_IN_BLOCKS = 4; // How old can data be in the cache?

const slice = createSlice({
  name: "batcher",
  initialState: {
    blockNumber: 0,
    onChainCalls: [],
    offChainCalls: [],
    cache: {},
    listenerCounts: {},
  } as BatcherState,
  reducers: {
    blockNumberChanged: (state, action: PayloadAction<number>) => {
      state.blockNumber = action.payload;
    },
    registrantRegistered(
      state,
      action: PayloadAction<{
        caller: string;
        onChainCalls: RegisteredCall[];
        offChainCalls: RegisteredCall[];
      }>
    ) {
      const { onChainCalls, offChainCalls } = action.payload;

      for (const call of onChainCalls) {
        const callId = serializeOnChainCall(call);

        state.onChainCalls.push(callId);
        state.listenerCounts[callId] = (state.listenerCounts[callId] ?? 0) + 1;
      }

      for (const call of offChainCalls) {
        const callId = serializeOffChainCall(call);

        state.offChainCalls.push(callId);
        state.listenerCounts[callId] = (state.listenerCounts[callId] ?? 0) + 1;
      }
    },
    registrantUnregistered(
      state,
      action: PayloadAction<{
        caller: string;
        onChainCalls: RegisteredCall[];
        offChainCalls: RegisteredCall[];
      }>
    ) {
      const { onChainCalls, offChainCalls } = action.payload;

      for (const call of onChainCalls) {
        const callId = serializeOnChainCall(call);

        state.listenerCounts[callId]--;
      }

      for (const call of offChainCalls) {
        const callId = serializeOffChainCall(call);

        state.listenerCounts[callId]--;
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(coingeckoDataLoaded, (state, action) => {
        for (const [address, result] of Object.entries(action.payload)) {
          const formattedCall = `retrieveCoingeckoData/${address}`;

          state.cache[formattedCall] = {
            result: result as any,
            fromBlockNumber: state.blockNumber,
          };
        }
      })
      .addCase(poolTradesAndSwapsLoaded, (state, action) => {
        const { poolId } = action.payload;
        const formattedCall = `poolTradesAndSwapsLoaded/${poolId}`;

        state.cache[formattedCall] = {
          result: action.payload as any,
          fromBlockNumber: state.blockNumber,
        };

        return state;
      })
      .addCase(
        stakingActions.stakingDataLoaded.type,
        (state, action: PayloadAction<NdxStakingPool[]>) => {
          const formattedCall = "requestStakingData";

          state.cache[formattedCall] = {
            result: action.payload as any,
            fromBlockNumber: state.blockNumber,
          };

          return state;
        }
      )
      .addCase(multicallDataReceived, (state, action) => {
        const { blockNumber, cache, listenerCounts } = state;
        const { resultsByRegistrant } = action.payload;

        for (const callsWithResults of Object.values(resultsByRegistrant)) {
          for (const { call, result } of callsWithResults) {
            cache[call] = {
              result,
              fromBlockNumber: blockNumber,
            };
          }
        }

        const oldCalls: Record<string, true> = {};
        for (const [call, value] of Object.entries(listenerCounts)) {
          if (value === 0) {
            oldCalls[call] = true;
            delete listenerCounts[call];
          }
        }

        state.onChainCalls = state.onChainCalls.filter(
          (call) => !oldCalls[call]
        );
        state.offChainCalls = state.offChainCalls.filter(
          (call) => !oldCalls[call]
        );

        return state;
      })
      .addCase(userActions.userDisconnected.type, (state) => {
        state.onChainCalls = [];
        state.offChainCalls = [];
        state.listenerCounts = {};
      }),
});

export const { actions } = slice;

export const selectors = {
  selectBlockNumber(state: AppState) {
    return state.batcher.blockNumber;
  },
  selectOnChainBatch(state: AppState) {
    return createOnChainBatch(state.batcher.onChainCalls);
  },
  selectOffChainBatch(state: AppState) {
    return state.batcher.offChainCalls;
  },
  selectCacheEntry(state: AppState, callId: string) {
    const { blockNumber, cache } = state.batcher;
    const entry = cache[callId];

    return entry && blockNumber - entry.fromBlockNumber <= MAX_AGE_IN_BLOCKS
      ? entry.result
      : null;
  },
};

export default slice.reducer;

// #region Helpers
export function createOnChainBatch(fromCalls: string[]) {
  return fromCalls.reduce(
    (prev, next) => {
      const [from] = next.split(": ");

      if (!prev.registrars.includes(from)) {
        prev.registrars.push(from);
        prev.callsByRegistrant[from] = [];
      }

      if (!prev.callsByRegistrant[from].includes(next)) {
        const deserialized = deserializeOnChainCall(next);

        if (deserialized) {
          prev.callsByRegistrant[from].push(next);
          prev.deserializedCalls.push(deserialized);
        }
      }

      prev.callsByRegistrant[from].push();

      return prev;
    },
    {
      registrars: [],
      callsByRegistrant: {},
      deserializedCalls: [],
    } as {
      registrars: string[];
      callsByRegistrant: Record<string, string[]>;
      deserializedCalls: Call[];
    }
  );
}

export function serializeOnChainCall(call: RegisteredCall): string {
  return `${call.interfaceKind}/${call.target}/${call.function}/${(
    call.args ?? []
  ).join("_")}`;
}

export function deserializeOnChainCall(callId: string): null | Call {
  try {
    const [interfaceKind, target, fn, args] = callId.split("/");
    const abi = abiLookup[interfaceKind as InterfaceKind];
    const common = {
      target,
      interface: abi,
      function: fn,
    };

    if (args) {
      return {
        ...common,
        args: args.split("_"),
      };
    } else {
      return common;
    }
  } catch (error) {
    console.error("Bad on-chain call ID", callId, error);
    return null;
  }
}

export function serializeOffChainCall(call: RegisteredCall): string {
  return `${call.function}/${(call.args ?? []).join("_")}`;
}

export function deserializeOffChainCall(
  callId: string,
  actions: Record<string, (...params: any[]) => AppThunk>
) {
  try {
    const [fn, args] = callId.split("/");
    const action = actions[fn];

    if (args) {
      const split = args.split("_");

      return action.bind(null, ...split);
    } else {
      return action;
    }
  } catch (error) {
    console.error("Bad off-chain call ID");
    return null;
  }
}
// #endregion
