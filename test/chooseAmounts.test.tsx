import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import ChooseAmounts from '../app/chooseAmounts';
import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderWithStore } from './testUtils';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('ChooseAmounts Component', () => {

    beforeEach(() => {
        mockPush.mockClear();
    });

    it('should render without crashing', () => {
        renderWithStore(<ChooseAmounts />);

        expect(screen.getByText('Por favor, elija saldos iniciales:')).toBeInTheDocument();
    });

    it('should update ARS amount on input change', () => {
        renderWithStore(<ChooseAmounts />);

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(input, { target: { value: '500' } });

        expect(input).toHaveValue(500);
    });

    it('should update USD amount on input change', () => {
        renderWithStore(<ChooseAmounts />);

        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '50' } });

        expect(input).toHaveValue(50);
    });

    it('should show error message if ARS amount input is empty', () => {
        renderWithStore(<ChooseAmounts />);

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione un monto en ARS válido.')).toBeInTheDocument();
    });

    it('should show error message if ARS amount is negative', () => {
        renderWithStore(<ChooseAmounts />);

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        const inputUSD = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '-50' } });
        fireEvent.change(inputUSD, { target: { value: '50' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione montos mayores a 0.')).toBeInTheDocument();
    });

    it('should show error message if ARS amount is greater than 100.000.000', () => {
        renderWithStore(<ChooseAmounts />);

        const input = screen.getByPlaceholderText('Seleccione monto en ARS');
        const inputUSD = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '100000000000' } });
        fireEvent.change(inputUSD, { target: { value: '50' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Máximo excedido. Por favor, seleccione montos menores a 100.000.000.')).toBeInTheDocument();
    });

    it('should show error message if USD amount input is empty', () => {
        renderWithStore(<ChooseAmounts />);

        const inputARS = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(inputARS, { target: { value: '50' } });
        const input = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione un monto en USD válido.')).toBeInTheDocument();
    });

    it('should show error message if USD amount is negative', () => {
        renderWithStore(<ChooseAmounts />);

        const inputARS = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(inputARS, { target: { value: '50' } });

        const inputUSD = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(inputUSD, { target: { value: '-50' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Por favor, seleccione montos mayores a 0.')).toBeInTheDocument();
    });

    it('should show error message if USD amount is greater than 100.000.000', () => {
        renderWithStore(<ChooseAmounts />);

        const inputARS = screen.getByPlaceholderText('Seleccione monto en ARS');
        fireEvent.change(inputARS, { target: { value: '50' } });

        const inputUSD = screen.getByPlaceholderText('Seleccione monto en USD');
        fireEvent.change(inputUSD, { target: { value: '1000000000000' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(screen.getByText('Máximo excedido. Por favor, seleccione montos menores a 100.000.000.')).toBeInTheDocument();
    });

    it('should navigate to /mainCard when continuing with valid amounts', () => {
        renderWithStore(<ChooseAmounts />);

        fireEvent.change(screen.getByPlaceholderText('Seleccione monto en ARS'), { target: { value: '500' } });
        fireEvent.change(screen.getByPlaceholderText('Seleccione monto en USD'), { target: { value: '50' } });
        fireEvent.click(screen.getAllByText('Continuar')[0]);

        expect(mockPush).toHaveBeenCalledWith('/mainCard');
    });

    it('should navigate to /mainCard when continuing with default balances', () => {
        renderWithStore(<ChooseAmounts />);

        fireEvent.click(screen.getAllByText('Continuar')[1]);

        expect(mockPush).toHaveBeenCalledWith('/mainCard');
    });
});
