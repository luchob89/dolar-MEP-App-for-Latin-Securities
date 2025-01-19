import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { SellCalculationResult } from '../app/mainCard/SellCalculationResult';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';
import '@testing-library/jest-dom';

describe('SellCalculationResult Component', () => {
    const mockAL30Data: AL30Data = {
        ticker: 'AL30',
        ars_bid: 79770,
        ars_ask: 79790,
        usd_bid: 68.23,
        usd_ask: 68.25,
    };

    const defaultProps = {
        amount: 100,
        status: 'ready' as 'ready' | 'pending',
        AL30Data: mockAL30Data,
        balanceARS: 10000,
        balanceUSD: 100,
        dispatch: jest.fn(),
        ars_bid: 100,
        AL30Price: 1,
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <SellCalculationResult {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Monto a vender:')).toBeInTheDocument();
    });

    it('should show error message if balance is insufficient', () => {
        const props = { ...defaultProps, balanceUSD: 50 };
        render(
            <Provider store={store}>
                <SellCalculationResult {...props} />
            </Provider>
        );

        expect(screen.getByText('Saldo insuficiente. Por favor, elija un monto menor.')).toBeInTheDocument();
    });

    it('should open confirmation modal on sell button click', () => {
        render(
            <Provider store={store}>
                <SellCalculationResult {...defaultProps} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Vender'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show success modal after confirming sale', async () => {
        render(
            <Provider store={store}>
                <SellCalculationResult {...defaultProps} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Vender'));
        fireEvent.click(screen.getByText('Aceptar'));

        await waitFor(() => expect(screen.getByText('Éxito!')).toBeInTheDocument());
    });
});
