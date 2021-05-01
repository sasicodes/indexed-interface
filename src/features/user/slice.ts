import { NDX_ADDRESS } from "config";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { convert, createMulticallDataParser } from "helpers"; // Circular dependency.
import { fetchMulticallData } from "../batcher/requests";
import { stakingMulticallDataParser } from "../staking";
import { tokensSelectors } from "../tokens";
import type { AppState } from "../store";
import type { NormalizedUser } from "./types";

export type ApprovalStatus = "unknown" | "approval needed" | "approved";

const initialState: NormalizedUser = {
  address: "",
  allowances: {},
  balances: {},
  staking: {},
  ndx: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userAddressSelected(state, action: PayloadAction<string>) {
      state.address = action.payload;
    },
    userDisconnected() {
      return initialState;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(fetchMulticallData.fulfilled, (state, action) => {
      const userData = userMulticallDataParser(action.payload);
      const stakingData = stakingMulticallDataParser(action.payload);

      if (userData) {
        const { allowances, balances, ndx } = userData;
        for (const key of Object.keys(balances)) {
          state.balances[key.toLowerCase()] = balances[key];
        }
        for (const key of Object.keys(allowances)) {
          state.allowances[key.toLowerCase()] = allowances[key];
        }
        state.ndx = ndx;
      }

      if (stakingData) {
        for (const [stakingPoolAddress, update] of Object.entries(
          stakingData
        )) {
          if (update.userData) {
            state.staking[stakingPoolAddress] = {
              balance: update.userData.userStakedBalance,
              earned: update.userData.userRewardsEarned,
            };
          }
        }
      }

      return state;
    }),
});

export const { actions: userActions, reducer: userReducer } = slice;

export const userSelectors = {
  selectUser(state: AppState) {
    return state.user;
  },
  selectUserAddress(state: AppState) {
    return state.user.address;
  },
  selectNdxBalance(state: AppState) {
    return state.user.ndx ? convert.toBalanceNumber(state.user.ndx) : 0;
  },
  selectTokenAllowance(state: AppState, poolId: string, tokenId: string) {
    return state.user.allowances[`user${poolId}-user${tokenId}`.toLowerCase()];
  },
  selectTokenBalance(state: AppState, tokenId: string) {
    return state.user.balances[tokenId.toLowerCase()] ?? "0";
  },
  selectTokenBalances(state: AppState, tokenIds: string[]) {
    return tokenIds.map((id) => state.user.balances[id.toLowerCase()] ?? "0");
  },
  selectStakingInfoLookup(state: AppState) {
    const stakingPoolIds = Object.keys(state.user.staking);
    return stakingPoolIds.reduce(
      (prev, next) => ({
        ...prev,
        [next as string]: state.user.staking[next],
      }),
      {} as Record<string, { balance: string; earned: string }>
    );
  },
  selectApprovalStatus(
    state: AppState,
    spender: string,
    tokenId: string,
    amount: string
  ): ApprovalStatus {
    const entry = tokensSelectors.selectTokenById(state, tokenId);

    if (entry) {
      const allowance = userSelectors.selectTokenAllowance(
        state,
        spender,
        tokenId
      );
      if (allowance) {
        const needsApproval = convert
          .toBigNumber(amount)
          .isGreaterThan(convert.toBigNumber(allowance));

        return needsApproval ? "approval needed" : "approved";
      } else {
        return "unknown";
      }
    } else {
      return "unknown";
    }
  },
  selectTokenSymbolsToBalances(state: AppState) {
    const tokenLookup = tokensSelectors.selectTokenLookup(state);

    return Object.entries(tokenLookup).reduce((prev, [key, value]) => {
      if (value) {
        prev[value.symbol.toLowerCase()] = convert.toBalance(
          userSelectors.selectTokenBalance(state, key)
        );
      }

      return prev;
    }, {} as Record<string, string>);
  },
};

// #region Helpers
const userMulticallDataParser = createMulticallDataParser("User", (calls) => {
  const formattedUserDetails = calls.reduce(
    (prev, next) => {
      const [, details] = next;
      const { allowance: allowanceCall, balanceOf: balanceOfCall } = details;

      if (allowanceCall && balanceOfCall) {
        const [_allowanceCall] = allowanceCall;
        const [_balanceOfCall] = balanceOfCall;
        const tokenAddress = _allowanceCall.target;
        const [, poolAddress] = _allowanceCall.args!;
        const [allowance] = _allowanceCall.result ?? [];
        const [balanceOf] = _balanceOfCall.result ?? [];
        const combinedId = `user${poolAddress}-user${tokenAddress}`;

        if (allowance) {
          prev.allowances[combinedId.toLowerCase()] = allowance.toString();
        }

        if (balanceOf) {
          prev.balances[tokenAddress.toLowerCase()] = balanceOf.toString();
        }
      } else if (balanceOfCall.length > 0 && balanceOfCall[0].result) {
        // NDX token has no allowance.
        const [_balanceOfCall] = balanceOfCall;
        const [balanceOf] = _balanceOfCall.result ?? [];
        const tokenAddress = _balanceOfCall.target.toLowerCase();
        const value = (balanceOf ?? "").toString();

        prev.balances[tokenAddress] = value;

        if (tokenAddress === NDX_ADDRESS.toLowerCase()) {
          prev.ndx = value;
        }
      }

      return prev;
    },
    {
      allowances: {},
      balances: {},
      ndx: null,
    } as {
      allowances: Record<string, string>;
      balances: Record<string, string>;
      ndx: null | string;
    }
  );

  return formattedUserDetails;
});
// #endregion
