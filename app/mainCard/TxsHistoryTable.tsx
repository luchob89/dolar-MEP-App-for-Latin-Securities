import { txRegistry } from '@/features/userDataSlice';
import { useState, useEffect } from 'react';
import { formatUSD, formatARS } from './mainCard';

export const TxsHistoryTable = ({ txs }: { txs: txRegistry[]; }) => {

    // Hook para detectar si estamos en desktop o mobile
    const [isDesktop, setIsDesktop] = useState<boolean>(true);

    // Hook para detectar el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (txs.length > 0) return (
        <div className='txsHistoryContainer mt-4 w-100'>
            <h4 className='text-center mt-1 mb-0'>Historial de Transacciones</h4>
            <div className='text-center text-muted mb-2 mt-0'><small>Ordenadas por más recientes</small></div>
            <table className="table-responsive w-100">
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        {isDesktop && <th scope="col">Tipo</th>}
                        {isDesktop && <th className='text-center' scope="col">Pre Saldo</th>}
                        <th className='text-center' scope="col">Monto</th>
                        {isDesktop && <th className='text-center' scope="col">Post Saldo</th>}
                        <th className='text-end' scope="col">Cotización</th>
                    </tr>
                </thead>
                <tbody>
                    {txs.map((tx, index) => (
                        <tr key={index} className={tx.type === 'sell' ? 'text-danger' : 'text-success'} style={{ fontSize: '.8em' }}>
                            <td>{tx.date}</td>
                            {isDesktop && <td>{tx.type === 'sell' ? 'Venta' : 'Compra'}</td>}
                            {isDesktop && <td className='text-center'>{tx.type === 'sell' ? formatUSD(tx.pre) : formatARS(tx.pre)}</td>}
                            <td className='text-center'><strong>{formatUSD(tx.amount)}</strong></td>
                            {isDesktop && <td className='text-center'>{tx.type === 'sell' ? formatUSD(tx.post) : formatARS(tx.post)}</td>}
                            <td className='text-end'>{formatUSD(tx.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    return null;
};
