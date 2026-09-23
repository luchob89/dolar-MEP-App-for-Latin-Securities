import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import BuyCard from '../app/mainCard/buy/page';
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

describe('BuyCard Component', () => {

    const balances = { balanceARS: 100000, balanceUSD: 100 };

    beforeEach(() => {
        mockPush.mockClear();
    });

    it('should render without crashing', () => {
        renderWithStore(<BuyCard />, balances);

        expect(screen.getByText('Compra de Dólar MEP')).toBeInTheDocument();
    });

    it('should update amount on input change', () => {
        renderWithStore(<BuyCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should show error message if input is empty', () => {
        renderWithStore(<BuyCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getByText('Calcular'))

        expect(screen.getByText('Por favor, seleccione un monto válido.')).toBeInTheDocument();
    });

    it('should show error message if amount is negative', () => {
        renderWithStore(<BuyCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '-20000' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Por favor, seleccione un monto mayor a 0.')).toBeInTheDocument();
    });

    it('should show error message if amount is greater than 100.000.000', () => {
        renderWithStore(<BuyCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '10000000000' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Máximo excedido. Por favor, seleccione montos menores a 100.000.000.')).toBeInTheDocument();
    });

    it('should show more data and Buy button on Calculate button click', () => {
        renderWithStore(<BuyCard />, balances);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });
        fireEvent.click(screen.getByText('Calcular'));

        expect(screen.getByText('Comprar')).toBeInTheDocument();
    });

    it('should show more data, total amount in ARS to be deducted and Buy button on "Buy All available amount" button click ', () => {
        renderWithStore(<BuyCard />, balances);

        fireEvent.click(screen.getByText('Comprar todo mi disponible'));

        const AL30Price = (mockAL30Data.ars_ask / 100) / (mockAL30Data.usd_bid / 100)
        const allARSAmount = balances.balanceARS / AL30Price
        const nominals = Math.floor(allARSAmount * AL30Price / (mockAL30Data.ars_ask / 100));

        expect(screen.getByText(new Intl.NumberFormat("de-DE").format(nominals))).toBeInTheDocument();
        expect(screen.getByText('Comprar')).toBeInTheDocument();
    });

    it('should navigate back to /mainCard when Volver is clicked', () => {
        renderWithStore(<BuyCard />, balances);

        fireEvent.click(screen.getByText('Volver'));

        expect(mockPush).toHaveBeenCalledWith('/mainCard');
    });
});
