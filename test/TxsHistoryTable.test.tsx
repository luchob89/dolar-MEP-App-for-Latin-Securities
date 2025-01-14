import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TxsHistoryTable } from '../app/mainCard/TxsHistoryTable';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect } from '@jest/globals';

describe('TxsHistoryTable Component', () => {
    const mockTxs = [
        {
            type: 'buy',
            amount: 100,
            date: '01/01/2023',
            price: 68.25,
            pre: 10000,
            post: 9900,
        },
        {
            type: 'sell',
            amount: 50,
            date: '02/01/2023',
            price: 68.23,
            pre: 9900,
            post: 9950,
        },
    ];

    const defaultProps = {
        txs: mockTxs,
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <TxsHistoryTable {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Historial de Transacciones')).toBeInTheDocument();
    });

    it('should display transaction details', () => {
        render(
            <Provider store={store}>
                <TxsHistoryTable {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('buy')).toBeInTheDocument();
        expect(screen.getByText('sell')).toBeInTheDocument();
        expect(screen.getByText('01/01/2023')).toBeInTheDocument();
        expect(screen.getByText('02/01/2023')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should display correct pre and post balances', () => {
        render(
            <Provider store={store}>
                <TxsHistoryTable {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('10000')).toBeInTheDocument();
        expect(screen.getByText('9900')).toBeInTheDocument();
        expect(screen.getByText('9950')).toBeInTheDocument();
    });
});
