import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeMode, selectBalanceARS, selectBalanceUSD, selectMode } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import BuyCard from './buyCard';
import SellCard from './sellCard';

export default function MainCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch      = useAppDispatch()
    const mode          = useAppSelector(selectMode)
    const balanceARS    = new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS", currencyDisplay: 'code' }).format(useAppSelector(selectBalanceARS))
    const balanceUSD    = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(useAppSelector(selectBalanceUSD))

    if ( mode === 'buy' ) return <BuyCard AL30Data={AL30Data}/>
    // if ( mode === 'sell' ) return <SellCard mepData={mepData}/>

    return(
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb-3'><h4>Bienvenidx a la aplicación de Compra/Venta de Dolar MEP</h4></Card.Title>
                    
                    <div className='mt-3 mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo Actual ARS: </h6>
                        <h4>{balanceARS}</h4>
                    </div>
                    <div className='mt-1 mb-3 d-flex justify-content-around align-items-center'>
                        <h6>Saldo Actual USD: </h6>
                        <h4>{balanceUSD}</h4>
                    </div>

                    <Card.Subtitle className="mb-3 text-muted">¿Qué desea hacer hoy?</Card.Subtitle>
                    <div className="d-flex gap-2 mb-2 mt-2 justify-content-center">
                        <Button variant="primary" size="lg" onClick={() => { dispatch(changeMode('buy')) }}>
                            Comprar
                        </Button>
                        <Button variant="secondary" size="lg" onClick={() => { dispatch(changeMode('sell')) }}>
                            Vender
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Fade>
    )
}