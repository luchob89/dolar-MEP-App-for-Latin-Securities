import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ChooseAmounts from '../app/mainCard/chooseAmounts';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';
import '@testing-library/jest-dom';

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

        expect(screen.getByText('Por favor, elija saldos iniciales:')).toBeInTheDocument();
    });

    it('should update ARS amount on input change', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should update USD amount on input change', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if ARS amount input is empty', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione un monto en ARS válido.')).toBeInTheDocument();
    });

    it('should show error message if ARS amount is negative', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        const inputUSD = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '-50' } });
        fireEvent.change(inputUSD, { target: { value: '50' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione montos mayores a 0.')).toBeInTheDocument();
    });

    it('should show error message if USD amount input is empty', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const inputARS = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(inputARS, { target: { value: '50' } });
        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione un monto en USD válido.')).toBeInTheDocument();
    });

    it('should show error message if USD amount is negative', () => {
        render(
            <Provider store={store}>
                <ChooseAmounts {...defaultProps as any} />
            </Provider>
        );

        const inputARS = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(inputARS, { target: { value: '50' } });

        const inputUSD = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(inputUSD, { target: { value: '-50' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione montos mayores a 0.')).toBeInTheDocument();
    });
});
