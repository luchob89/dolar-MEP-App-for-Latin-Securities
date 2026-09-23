import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { SellCalculationResult } from '../app/mainCard/sell/SellCalculationResult';
import { AL30DataType } from '@/features/getAL30Data';
import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import { ES } from '@/lang/ES';
import { renderWithStore } from './testUtils';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('SellCalculationResult Component', () => {
    const mockAL30Data: AL30DataType = {
        ticker: 'AL30',
        ars_bid: 79770,
        ars_ask: 79790,
        usd_bid: 68.23,
        usd_ask: 68.25,
    };

    const defaultProps = {
        amount: 100,
        status: 'ready' as 'ready' | 'pending',
        AL30Data: mockAL30Data,
        balanceARS: 10000,
        balanceUSD: 100,
        dispatch: jest.fn(),
        selectedLangObject: ES
    };

    beforeEach(() => {
        mockPush.mockClear();
    });

    it('should render without crashing', () => {
        renderWithStore(<SellCalculationResult {...defaultProps} />);

        expect(screen.getByText('Monto a vender:')).toBeInTheDocument();
    });

    it('should show error message if balance is insufficient', () => {
        const props = { ...defaultProps, balanceUSD: 50 };
        renderWithStore(<SellCalculationResult {...props} />);

        expect(screen.getByText('Saldo insuficiente. Por favor, elija un monto menor.')).toBeInTheDocument();
    });

    it('should open confirmation modal on sell button click', () => {
        renderWithStore(<SellCalculationResult {...defaultProps} />);

        fireEvent.click(screen.getByText('Vender'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show success modal after confirming sale', async () => {
        renderWithStore(<SellCalculationResult {...defaultProps} />);

        fireEvent.click(screen.getByText('Vender'));
        fireEvent.click(screen.getByText('Aceptar'));

        await waitFor(() => expect(screen.getByText('Éxito!')).toBeInTheDocument());
    });
});
