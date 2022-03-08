import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "../components/Header/authSlice";
import timelineReducer from "../features/post/timelineSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    timeline: timelineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
