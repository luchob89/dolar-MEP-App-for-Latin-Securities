import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BuyCard from '../app/mainCard/buyCard';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';

describe('BuyCard Component', () => {
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
                <BuyCard {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Comprar USD')).toBeInTheDocument();
    });

    it('should update amount on input change', () => {
        render(
            <Provider store={store}>
                <BuyCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should show error message if amount exceeds balance', () => {
        render(
            <Provider store={store}>
                <BuyCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '20000' } });

        expect(screen.getByText('Saldo insuficiente.')).toBeInTheDocument();
    });

    it('should dispatch buy action on button click', () => {
        const dispatchMock = jest.fn();
        const props = { ...defaultProps, dispatch: dispatchMock };
        render(
            <Provider store={store}>
                <BuyCard {...props} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        fireEvent.click(screen.getByText('Comprar'));

        expect(dispatchMock).toHaveBeenCalled();
    });
});
