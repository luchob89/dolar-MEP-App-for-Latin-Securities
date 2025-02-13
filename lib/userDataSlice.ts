import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "@/lib/store"

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
  txsHistory: txRegistry[],
  lang: string
}

// Initial value for the slice state
const initialState: userData = {
    balanceARS: 100000,
    balanceUSD: 100,
    txsHistory: [],
    lang: 'ES'
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
        addTxRegistry: (state, action: PayloadAction<txRegistry>) => {
            state.txsHistory.unshift(action.payload)
        },
        resetTxsHistory: state => {
            state.txsHistory = []
        },
        changeLang: (state, action: PayloadAction<string>) => {
            state.lang = action.payload
        }
    }
})

// Action creators
export const { changeBalanceARS, changeBalanceUSD, addTxRegistry, resetTxsHistory, changeLang } = userDataSlice.actions

// Slice Reducer
export default userDataSlice.reducer

// Selectors
export const selectBalanceARS = (state: RootState) => state.userData.balanceARS
export const selectBalanceUSD = (state: RootState) => state.userData.balanceUSD
export const selectTxsHistory = (state: RootState) => state.userData.txsHistory
export const selectLang       = (state: RootState) => state.userData.lang