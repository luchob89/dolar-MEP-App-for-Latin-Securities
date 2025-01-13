import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "@/app/store"

export interface txRegistry {
    date: string,
    amount: number,
    price: number,
    type: string,
    pre: number,
    post: number
} 

// Initial state interface
export interface userData {
  balanceARS: number,
  balanceUSD: number,
  mode: string,
  txsHistory: txRegistry[]
}

// Initial value for the slice state
const initialState: userData = {
    balanceARS: 100000,
    balanceUSD: 100,
    mode: 'chooseAmounts',
    txsHistory: []
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
        },
        addTxRegistry: (state, action: PayloadAction<txRegistry>) => {
            state.txsHistory.unshift(action.payload)
        },
        resetTxsHistory: state => {
            state.txsHistory = []
        }
    }
})

// Action creators
export const { changeBalanceARS, changeBalanceUSD, changeMode, addTxRegistry, resetTxsHistory } = userDataSlice.actions

// Slice Reducer
export default userDataSlice.reducer

// Selectors
export const selectBalanceARS = (state: RootState) => state.userData.balanceARS
export const selectBalanceUSD = (state: RootState) => state.userData.balanceUSD
export const selectMode       = (state: RootState) => state.userData.mode
export const selectTxsHistory = (state: RootState) => state.userData.txsHistory