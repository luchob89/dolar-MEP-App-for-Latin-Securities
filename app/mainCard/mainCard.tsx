import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeMode, selectBalanceARS, selectBalanceUSD, selectMode, selectTxsHistory, txRegistry } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import BuyCard from './buyCard';
import SellCard from './sellCard';
import { useState, useEffect } from 'react';
import ChooseAmounts from './chooseAmounts';

export const formatARS = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(amount);
export const formatUSD = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(amount);

const TxsHistoryTable = ({ txs }: { txs: txRegistry[] }) => {

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
        <>
            <h4 className='text-center mt-4 mb-0'>Historial de Transacciones</h4>
            <small className='text-center text-muted mb-2 mt-0'>Ordenadas por más recientes</small>
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
                        <tr key={index} className={tx.type === 'sell'? 'text-danger' : 'text-success'} style={{ fontSize:'.8em' }}>
                            <td>{tx.date}</td>
                            {isDesktop && <td>{tx.type === 'sell' ? 'Venta' : 'Compra'}</td>}
                            {isDesktop && <td className='text-center'>{tx.type === 'sell' ? formatUSD(tx.pre) : formatARS(tx.pre)}</td>}
                            <td className='text-center'><strong>{formatUSD(tx.amount)}</strong></td>
                            {isDesktop && <td className='text-center'>{tx.type === 'sell'? formatUSD(tx.post) : formatARS(tx.post)}</td>}
                            <td className='text-end'>{formatUSD(tx.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
    return null;
}

export default function MainCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch      = useAppDispatch()
    const mode          = useAppSelector(selectMode)
    const balanceARS    = useAppSelector(selectBalanceARS)
    const balanceUSD    = useAppSelector(selectBalanceUSD)
    const txsHistory    = useAppSelector(selectTxsHistory)

    if ( mode === 'chooseAmounts' ) return <ChooseAmounts />
    if ( mode === 'buy' ) return <BuyCard AL30Data={AL30Data} />
    if ( mode === 'sell' ) return <SellCard AL30Data={AL30Data} />

    return (
        <>
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb-3'>
                        <h3>Bienvenido a la aplicación de Compra/Venta de Dolar MEP</h3>
                    </Card.Title>
                    
                    <div className='mt-3 mb-1 d-flex justify-content-center align-items-center'>
                        <h6>Saldo ARS: &nbsp;</h6>
                        <h5><strong>{formatARS(balanceARS)}</strong></h5>
                    </div>
                    <div className='mt-1 mb-3 d-flex justify-content-center align-items-center'>
                            <h6>Saldo USD: &nbsp;</h6>
                        <h5><strong>{formatUSD(balanceUSD)}</strong></h5>
                    </div>

                    <Card.Subtitle className="mb-3 text-muted">¿Qué desea hacer hoy?</Card.Subtitle>
                    <div className="d-flex gap-2 mb-2 mt-2 justify-content-center">
                        <Button variant="success" disabled={balanceARS === 0} onClick={() => { dispatch(changeMode('buy')) }}>
                            Comprar USD
                        </Button>
                        <Button variant="danger" disabled={balanceUSD === 0} onClick={() => { dispatch(changeMode('sell')) }}>
                            Vender USD
                        </Button>
                    </div>
                    <Button variant="light" onClick={() => { dispatch(changeMode('chooseAmounts')) }}>
                        Volver
                    </Button>
                </Card.Body>
            </Card>
        </Fade>
        <TxsHistoryTable txs={txsHistory} />
        </>
    )
}
