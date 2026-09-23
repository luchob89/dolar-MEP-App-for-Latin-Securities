import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { BuyCalculationResult } from '../app/mainCard/buy/BuyCalculationResult';
import { AL30DataType } from '@/features/getAL30Data';
import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import { ES } from '@/lang/ES';
import { renderWithStore } from './testUtils';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('BuyCalculationResult Component', () => {
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
        ars_ask: 100,
        AL30Price: 1,
        selectedLangObject: ES
    };

    beforeEach(() => {
        mockPush.mockClear();
    });

    it('should render without crashing', () => {
        renderWithStore(<BuyCalculationResult {...defaultProps} />);

        expect(screen.getByText('Monto a comprar:')).toBeInTheDocument();
    });

    it('should show error message if balance is insufficient', () => {
        const props = { ...defaultProps, balanceARS: 50 };
        renderWithStore(<BuyCalculationResult {...props} />);

        expect(screen.getByText('Saldo insuficiente. Por favor, elija un monto menor.')).toBeInTheDocument();
    });

    it('should open confirmation modal on buy button click', () => {
        renderWithStore(<BuyCalculationResult {...defaultProps} />);

        fireEvent.click(screen.getByText('Comprar'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show success modal after confirming purchase', async () => {
        renderWithStore(<BuyCalculationResult {...defaultProps} />);

        fireEvent.click(screen.getByText('Comprar'));
        fireEvent.click(screen.getByText('Aceptar'));

        await waitFor(() => expect(screen.getByText('Éxito!')).toBeInTheDocument());
    });
});
