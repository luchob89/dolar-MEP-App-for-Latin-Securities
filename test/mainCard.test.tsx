import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainCard from '../app/mainCard/mainCard';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';

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
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <MainCard {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Comprar USD')).toBeInTheDocument();
        expect(screen.getByText('Vender USD')).toBeInTheDocument();
    });

    it('should update buy amount on input change', () => {
        render(
            <Provider store={store}>
                <MainCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should update sell amount on input change', () => {
        render(
            <Provider store={store}>
                <MainCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if buy amount exceeds balance', () => {
        render(
            <Provider store={store}>
                <MainCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '20000' } });

        expect(screen.getByText('Saldo insuficiente.')).toBeInTheDocument();
    });

    it('should show error message if sell amount exceeds balance', () => {
        render(
            <Provider store={store}>
                <MainCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '200' } });

        expect(screen.getByText('Saldo insuficiente.')).toBeInTheDocument();
    });

    it('should dispatch buy action on buy button click', () => {
        const dispatchMock = jest.fn();
        const props = { ...defaultProps, dispatch: dispatchMock };
        render(
            <Provider store={store}>
                <MainCard {...props} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        fireEvent.click(screen.getByText('Comprar'));

        expect(dispatchMock).toHaveBeenCalled();
    });

    it('should dispatch sell action on sell button click', () => {
        const dispatchMock = jest.fn();
        const props = { ...defaultProps, dispatch: dispatchMock };
        render(
            <Provider store={store}>
                <MainCard {...props} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        fireEvent.click(screen.getByText('Vender'));

        expect(dispatchMock).toHaveBeenCalled();
    });
});
