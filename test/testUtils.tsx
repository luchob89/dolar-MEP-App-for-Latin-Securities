import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userDataReducer, { userData } from '@/lib/userDataSlice';

const defaultUserData: userData = {
    balanceARS: 100000,
    balanceUSD: 100,
    txsHistory: [],
    lang: 'ES',
};

export function createTestStore(preloadedState?: Partial<userData>) {
    return configureStore({
        reducer: { userData: userDataReducer },
        preloadedState: { userData: { ...defaultUserData, ...preloadedState } },
    });
}

export function renderWithStore(ui: React.ReactElement, preloadedState?: Partial<userData>) {
    const store = createTestStore(preloadedState);
    return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
