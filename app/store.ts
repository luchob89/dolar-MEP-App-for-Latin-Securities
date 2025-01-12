import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '@/features/userDataSlice'

export const store = configureStore({
  reducer: {
    userData: userDataReducer
  }
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']