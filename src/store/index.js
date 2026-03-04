import { configureStore } from "@reduxjs/toolkit";
import { disputeApi } from "./disputeApi";

export const store = configureStore({
  reducer: {
    [disputeApi.reducerPath]: disputeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(disputeApi.middleware),
});