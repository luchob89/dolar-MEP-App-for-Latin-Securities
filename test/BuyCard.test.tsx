import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import BuyCard from '../app/mainCard/buyCard';
import { AL30Data } from '../app/page';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { ES } from '@/lang/ES';

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
        balanceARS: 100000,
        balanceUSD: 100,
        selectedLangObject: ES
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <BuyCard {...defaultProps} />
            </Provider>
        );

        expect(screen.getByText('Compra de Dólar MEP')).toBeInTheDocument();
    });

    it('should update amount on input change', () => {
        render(
            <Provider store={store}>
                <BuyCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should show error message if input is empty', () => {
            render(
                <Provider store={store}>
                    <BuyCard {...defaultProps} />
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
                <BuyCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '-20000' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Por favor, seleccione un monto mayor a 0.')).toBeInTheDocument();
    });

    it('should show error message if amount is greater than 100.000.000', () => {
        render(
            <Provider store={store}>
                <BuyCard {...defaultProps} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '10000000000' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Máximo excedido. Por favor, seleccione montos menores a 100.000.000.')).toBeInTheDocument();
    });

    it('should show more data and Buy button on Calculate button click', () => {

        const props = { ...defaultProps };
            render(
                <Provider store={store}>
                    <BuyCard {...props} />
                </Provider>
            );
    
            const input = screen.getByPlaceholderText('Seleccione monto en USD');
            fireEvent.change(input, { target: { value: '50' } });
            fireEvent.click(screen.getByText('Calcular'));
    
            expect(screen.getByText('Comprar')).toBeInTheDocument();
    });

    it('should show more data, total amount in ARS to be deducted and Buy button on "Buy All available amount" button click ', () => {

        const props = { ...defaultProps };
        render(
            <Provider store={store}>
                <BuyCard {...props} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Comprar todo mi disponible'));

        const AL30Price = (mockAL30Data.ars_ask/100) / (mockAL30Data.usd_bid/100)
        const allARSAmount = defaultProps.balanceARS / AL30Price
        const nominals = Math.floor(allARSAmount * AL30Price / (mockAL30Data.ars_ask/100));

        expect(screen.getByText( nominals )).toBeInTheDocument();
        expect(screen.getByText('Comprar')).toBeInTheDocument();
    });
});
