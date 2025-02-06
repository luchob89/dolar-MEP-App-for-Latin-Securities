import { txRegistry } from '@/features/userDataSlice';
import { useState, useEffect } from 'react';
import { formatUSD, formatARS } from './mainCard';

export const TxsHistoryTable = ({ txs, selectedLangObject }: { txs: txRegistry[], selectedLangObject: { [k: string]: string } }) => {

    // Hook for detecting Desktop or Mobile device
    const [isDesktop, setIsDesktop] = useState<boolean>(true);

    // Hook for detecting screen size
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
            <h4 className='text-center mt-1 mb-0'>{selectedLangObject.historial}</h4>
            <div className='text-center text-muted mb-2 mt-0'><small>{selectedLangObject.ordenadas}</small></div>
            <table className="table-responsive w-100">
                <thead>
                    <tr>
                        <th scope="col">{selectedLangObject.fecha}</th>
                        {isDesktop && <th scope="col">{selectedLangObject.tipo}</th>}
                        {isDesktop && <th className='text-center' scope="col">{selectedLangObject.presaldo}</th>}
                        <th className='text-center' scope="col">{selectedLangObject.monto}</th>
                        {isDesktop && <th className='text-center' scope="col">{selectedLangObject.postsaldo}</th>}
                        <th className='text-end' scope="col">{selectedLangObject.cotizacion}</th>
                    </tr>
                </thead>
                <tbody>
                    {txs.map((tx, index) => (
                        <tr key={index} className={tx.type === 'sell' ? 'text-danger' : 'text-success'} style={{ fontSize: '.8em' }}>
                            <td>{tx.date}</td>
                            {isDesktop && <td>{tx.type === 'sell' ? selectedLangObject.venta : selectedLangObject.compra}</td>}
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
