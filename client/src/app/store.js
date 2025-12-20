import { configureStore } from '@reduxjs/toolkit';
import { bloodApi } from '../features/api/bloodApi';
import authSlice from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [bloodApi.reducerPath]: bloodApi.reducer,
    auth: authSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bloodApi.middleware),

  devTools: true,
});
