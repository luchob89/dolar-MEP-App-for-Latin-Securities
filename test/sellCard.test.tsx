import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SellCard from '../app/mainCard/sellCard';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { ES } from '@/lang/ES';

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
        selectedLangObject: ES
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Venta de Dólar MEP')).toBeInTheDocument();
    });

    it('should update amount on input change', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if input is empty', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getByText('Calcular'))

        expect(screen.getByText('Por favor, seleccione un monto válido.')).toBeInTheDocument();
    });

    it('should show error message if amount is negative', () => {
        render(
            <Provider store={store}>
                <SellCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '-200' } });
        fireEvent.click(screen.getByText('Calcular'))

        expect(screen.getByText('Por favor, seleccione un monto mayor a 0.')).toBeInTheDocument();
    });

    it('should show more data and Sell button on Calculate button click', () => {
        const dispatchMock = jest.fn();
        const props = { ...defaultProps, dispatch: dispatchMock };
        render(
            <Provider store={store}>
                <SellCard {...props} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Vender')).toBeInTheDocument();
    });

    it('should show more data, total amount in ARS to be deducted and Buy button on "Buy All available amount" button click ', () => {
    
            const props = { ...defaultProps };
            render(
                <Provider store={store}>
                    <SellCard {...props} />
                </Provider>
            );
    
            fireEvent.click(screen.getByText('Vender todo mi disponible'));
            const nominals = Math.floor(defaultProps.balanceUSD / (mockAL30Data.usd_ask/100));
    
            expect(screen.getByText( nominals )).toBeInTheDocument();
            expect(screen.getByText('Vender')).toBeInTheDocument();
    });
});
