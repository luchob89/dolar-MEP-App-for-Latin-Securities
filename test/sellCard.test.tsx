import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SellCard from '../app/mainCard/sellCard';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';

describe('SellCard Component', () => {
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
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Vender USD')).toBeInTheDocument();
    });

    it('should update amount on input change', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if amount exceeds balance', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '200' } });

        expect(screen.getByText('Saldo insuficiente.')).toBeInTheDocument();
    });

    it('should dispatch sell action on button click', () => {
        const dispatchMock = jest.fn();
        const props = { ...defaultProps, dispatch: dispatchMock };
        render(
            <Provider store={store}>
                <SellCard {...props} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        fireEvent.click(screen.getByText('Vender'));

        expect(dispatchMock).toHaveBeenCalled();
    });
});
