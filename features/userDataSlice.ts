import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "@/app/store"

// Initial state interface
export interface userData {
  balanceARS: number,
  balanceUSD: number,
  mode: string
}

// Initial value for the slice state
const initialState: userData = {
  balanceARS: 100000,
  balanceUSD: 100,
  mode: ''
}

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    changeBalanceARS: (state, action: PayloadAction<number>) => {
        state.balanceARS = action.payload
    },
    changeBalanceUSD: (state, action: PayloadAction<number>) => {
        state.balanceUSD = action.payload
    },
    changeMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload
    }
  }
})

// Action creators
export const { changeBalanceARS, changeBalanceUSD, changeMode } = userDataSlice.actions

// Slice Reducer
export default userDataSlice.reducer

// Selectors
export const selectBalanceARS = (state: RootState) => state.userData.balanceARS
export const selectBalanceUSD = (state: RootState) => state.userData.balanceUSD
export const selectMode       = (state: RootState) => state.userData.mode