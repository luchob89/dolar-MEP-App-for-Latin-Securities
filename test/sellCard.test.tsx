import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import SellCard from '../app/mainCard/sell/page';
import { AL30DataType } from '@/features/getAL30Data';
import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderWithStore } from './testUtils';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockAL30Data: AL30DataType = {
    ticker: 'AL30',
    ars_bid: 79770,
    ars_ask: 79790,
    usd_bid: 68.23,
    usd_ask: 68.25,
};

jest.mock('@/features/getAL30Data', () => ({
    useAL30Data: () => ({ AL30Data: mockAL30Data, error: undefined, isLoading: false }),
}));

describe('SellCard Component', () => {

    const balances = { balanceARS: 10000, balanceUSD: 100 };

    beforeEach(() => {
        mockPush.mockClear();
    });

    it('should render without crashing', () => {
        renderWithStore(<SellCard />, balances);

        expect(screen.getByText('Venta de Dólar MEP')).toBeInTheDocument();
    });

    it('should update amount on input change', () => {
        renderWithStore(<SellCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if input is empty', () => {
        renderWithStore(<SellCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getByText('Calcular'))

        expect(screen.getByText('Por favor, seleccione un monto válido.')).toBeInTheDocument();
    });

    it('should show error message if amount is negative', () => {
        renderWithStore(<SellCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '-200' } });
        fireEvent.click(screen.getByText('Calcular'))

        expect(screen.getByText('Por favor, seleccione un monto mayor a 0.')).toBeInTheDocument();
    });

    it('should show error message if amount is greater than 100.000.000', () => {
        renderWithStore(<SellCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '10000000000000' } });
        fireEvent.click(screen.getByText('Calcular'))

        expect(screen.getByText('Máximo excedido. Por favor, seleccione montos menores a 100.000.000.')).toBeInTheDocument();
    });

    it('should show more data and Sell button on Calculate button click', () => {
        renderWithStore(<SellCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Vender')).toBeInTheDocument();
    });

    it('should show more data, total amount and Sell button on "Sell All available amount" button click ', () => {
        renderWithStore(<SellCard />, balances);

        fireEvent.click(screen.getByText('Vender todo mi disponible'));
        const nominals = Math.floor(balances.balanceUSD / (mockAL30Data.usd_ask / 100));

        expect(screen.getByText(new Intl.NumberFormat("de-DE").format(nominals))).toBeInTheDocument();
        expect(screen.getByText('Vender')).toBeInTheDocument();
    });

    it('should navigate back to /mainCard when Volver is clicked', () => {
        renderWithStore(<SellCard />, balances);

        fireEvent.click(screen.getByText('Volver'));

        expect(mockPush).toHaveBeenCalledWith('/mainCard');
    });
});
