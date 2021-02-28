import { NormalizedCategory } from "ethereum";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  receivedInitialStateFromServer,
  receivedStatePatchFromServer,
  subgraphDataLoaded,
} from "features/actions";
import type { AppState } from "features/store";

import ZeroExOne from "./local-data/0x1.json";
import ZeroExThree from "./local-data/0x3.json";
import ZeroExTwo from "./local-data/0x2.json";

// #region Local Data Initialization
// --
const LOCAL_DATA_LOOKUP: Record<string, typeof ZeroExOne> = {
  "0x1": ZeroExOne,
  "0x2": ZeroExTwo,
  "0x3": ZeroExThree,
};

const adapter = createEntityAdapter<NormalizedCategory>();
const initialState = adapter.getInitialState();
const stateWithLocalData = adapter.addMany(
  initialState,
  Object.values(LOCAL_DATA_LOOKUP)
);
// #endregion

const slice = createSlice({
  name: "categories",
  initialState: stateWithLocalData,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(subgraphDataLoaded, (state, action) => {
        const { categories } = action.payload;
        const mapped = selectors
          .selectAll({ categories: state } as AppState)
          .map((existing) => ({
            ...existing,
            ...categories.entities[existing.id],
          }));

        adapter.upsertMany(state, mapped);
      })
      .addCase(receivedInitialStateFromServer, (_, action) => {
        const { categories } = action.payload;

        return categories;
      })
      .addCase(receivedStatePatchFromServer, (_, action) => {
        const { categories } = action.payload;

        return categories;
      }),
});

export const { actions } = slice;

export const selectors = {
  ...adapter.getSelectors((state: AppState) => state.categories),
  selectCategory: (state: AppState, categoryId: string) =>
    selectors.selectById(state, categoryId),
  selectAllCategories: (state: AppState) => selectors.selectAll(state),
};

export default slice.reducer;
