import React from 'react';
import { render, screen } from '@testing-library/react';
import { TxsHistoryTable } from '../app/mainCard/TxsHistoryTable';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { ES } from '@/lang/ES';

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
        selectedLangObject: ES
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

        expect(screen.getByText('Compra')).toBeInTheDocument();
        expect(screen.getByText('Venta')).toBeInTheDocument();
        expect(screen.getByText('01/01/2023')).toBeInTheDocument();
        expect(screen.getByText('02/01/2023')).toBeInTheDocument();
        expect(screen.getByText('100,00 USD')).toBeInTheDocument();
        expect(screen.getByText('50,00 USD')).toBeInTheDocument();
    });

    it('should display correct pre and post balances', () => {
        render(
            <Provider store={store}>
                <TxsHistoryTable {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('10.000,00 ARS')).toBeInTheDocument();
        expect(screen.getByText('9.900,00 ARS')).toBeInTheDocument();
        expect(screen.getByText('9.950,00 USD')).toBeInTheDocument();
    });
});
