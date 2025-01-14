/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChooseAmounts from '../app/mainCard/chooseAmounts';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';

describe('ChooseAmounts Component', () => {
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
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        expect(screen.getByText('Elegir Montos')).toBeInTheDocument();
    });

    it('should update ARS amount on input change', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should update USD amount on input change', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if ARS amount exceeds balance', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(input, { target: { value: '20000' } });

        expect(screen.getByText('Saldo insuficiente.')).toBeInTheDocument();
    });

    it('should show error message if USD amount exceeds balance', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(input, { target: { value: '200' } });

        expect(screen.getByText('Saldo insuficiente.')).toBeInTheDocument();
    });

    it('should dispatch action on button click', () => {
        const dispatchMock = jest.fn();
        const props = { ...defaultProps, dispatch: dispatchMock };
        render(
            <Provider store={store}>
                <ChooseAmounts {...props as any} />
            </Provider>
        );

        const inputARS = screen.getByPlaceholderText('Ingrese monto en ARS');
        fireEvent.change(inputARS, { target: { value: '500' } });

        const inputUSD = screen.getByPlaceholderText('Ingrese monto en USD');
        fireEvent.change(inputUSD, { target: { value: '50' } });

        fireEvent.click(screen.getByText('Confirmar'));

        expect(dispatchMock).toHaveBeenCalled();
    });
});
