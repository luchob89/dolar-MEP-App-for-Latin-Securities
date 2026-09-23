import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import MainCard from '../app/mainCard/page';
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

describe('MainCard Component', () => {

    beforeEach(() => {
        mockPush.mockClear();
    });

    it('should render without crashing', () => {
        renderWithStore(<MainCard />);

        expect(screen.getByText('Comprar USD')).toBeInTheDocument();
        expect(screen.getByText('Vender USD')).toBeInTheDocument();
    });

    it('should navigate to /mainCard/buy on buy button click', () => {
        renderWithStore(<MainCard />);

        fireEvent.click(screen.getByText('Comprar USD'));

        expect(mockPush).toHaveBeenCalledWith('/mainCard/buy');
    });

    it('should navigate to /mainCard/sell on sell button click', () => {
        renderWithStore(<MainCard />);

        fireEvent.click(screen.getByText('Vender USD'));

        expect(mockPush).toHaveBeenCalledWith('/mainCard/sell');
    });

    it('should navigate to / on Back button click', () => {
        renderWithStore(<MainCard />);

        fireEvent.click(screen.getByText('Volver'));

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should disable the buy button when ARS balance is 0', () => {
        renderWithStore(<MainCard />, { balanceARS: 0 });

        expect(screen.getByText('Comprar USD').closest('button')).toBeDisabled();
    });

    it('should disable the sell button when USD balance is 0', () => {
        renderWithStore(<MainCard />, { balanceUSD: 0 });

        expect(screen.getByText('Vender USD').closest('button')).toBeDisabled();
    });

    it('should render the transaction history when there are past transactions', () => {
        renderWithStore(<MainCard />, {
            txsHistory: [
                { type: 'buy', amount: 100, date: '01/01/2023', price: 68.25, pre: 10000, post: 9900 },
            ],
        });

        expect(screen.getByText('Historial de Transacciones')).toBeInTheDocument();
    });
});
