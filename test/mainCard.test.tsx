import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MainCard from '../app/mainCard/page';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { changeMode } from '@/features/userDataSlice';
import { ES } from '@/lang/ES';

describe('MainCard Component', () => {
    const mockAL30Data: AL30Data = {
        ticker: 'AL30',
        ars_bid: 79770,
        ars_ask: 79790,
        usd_bid: 68.23,
        usd_ask: 68.25,
    };

    const defaultProps = {
        AL30Data: mockAL30Data,
        balanceARS: 10000,
        balanceUSD: 100,
        dispatch: jest.fn(),
        selectedLangObject: ES
    };

    it('should render without crashing', () => {

        store.dispatch(changeMode(''))

        render(
            <Provider store={store}>
                <MainCard {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Comprar USD')).toBeInTheDocument();
        expect(screen.getByText('Vender USD')).toBeInTheDocument();
    });

    it('should dispatch changeMode action and show buy menu on buy button click', () => {
        const props = { ...defaultProps };

        store.dispatch(changeMode(''))

        render(
            <Provider store={store}>
                <MainCard {...props} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Comprar USD'));
        expect(screen.getByText('Compra de Dólar MEP')).toBeInTheDocument();
    });

    it('should dispatch changeMode action and show sell menu on sell button click', () => {
        const props = { ...defaultProps };

        store.dispatch(changeMode(''))

        render(
            <Provider store={store}>
                <MainCard {...props} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Vender USD'));
        expect(screen.getByText('Venta de Dólar MEP')).toBeInTheDocument();
    });

    it('should dispatch changeMode action and show chooseAmounts component on Back button click', () => {
        const props = { ...defaultProps };

        store.dispatch(changeMode(''))

        render(
            <Provider store={store}>
                <MainCard {...props} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Volver'));
        expect(screen.getByText('Por favor, elija saldos iniciales:')).toBeInTheDocument();
    });
});
