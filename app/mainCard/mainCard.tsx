import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeBalanceARS, changeBalanceUSD, changeMode, selectBalanceARS, selectBalanceUSD, selectMode, selectTxsHistory } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import BuyCard from './buyCard';
import SellCard from './sellCard';
import ChooseAmounts from './chooseAmounts';
import { TxsHistoryTable } from './TxsHistoryTable';

export const formatARS = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(amount);
export const formatUSD = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(amount);

export default function MainCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch      = useAppDispatch()
    const mode          = useAppSelector(selectMode)
    const balanceARS    = useAppSelector(selectBalanceARS)
    const balanceUSD    = useAppSelector(selectBalanceUSD)
    const txsHistory = useAppSelector(selectTxsHistory)

    const goBack = () => {
        dispatch(changeBalanceARS(100000))
        dispatch(changeBalanceUSD(100))
        dispatch(changeMode('chooseAmounts'))
    }

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
                    
                    <div className='mt-4 mb-1 d-flex justify-content-center align-items-center'>
                        <h6>Saldo ARS: &nbsp;</h6>
                        <h5><strong>{formatARS(balanceARS)}</strong></h5>
                    </div>
                    <div className='mt-1 mb-4 d-flex justify-content-center align-items-center'>
                        <h6>Saldo USD: &nbsp;</h6>
                        <h5><strong>{formatUSD(balanceUSD)}</strong></h5>
                    </div>

                    <Card.Subtitle className="mb-3 text-muted">¿Qué desea hacer hoy?</Card.Subtitle>
                    <div className="d-flex gap-2 mb-2 mt-2 justify-content-center">
                        <Button className='mainCard-btns' variant="success" disabled={balanceARS === 0} onClick={() => { dispatch(changeMode('buy')) }}>
                            Comprar USD
                            <small className='mainCard-small-text'>US${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format((AL30Data.ars_ask / 100) / (AL30Data.usd_bid / 100))}</small>
                        </Button>
                        <Button className='mainCard-btns' variant="danger" disabled={balanceUSD === 0} onClick={() => { dispatch(changeMode('sell')) }}>
                            Vender USD
                            <small className='mainCard-small-text'>US${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format((AL30Data.ars_bid / 100) / (AL30Data.usd_ask / 100))}</small>
                        </Button>
                    </div>

                    <Button variant="light" className='mt-3' onClick={goBack}>
                        Volver
                    </Button>
                </Card.Body>
            </Card>
        </Fade>
        <TxsHistoryTable txs={txsHistory} />
    </>
    )
}
