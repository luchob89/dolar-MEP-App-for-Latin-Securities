import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeBalanceARS, changeBalanceUSD, changeMode, selectBalanceARS, selectBalanceUSD } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';

const BuyCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch }: { amount: number, status: 'pending' | 'ready', AL30Data: AL30Data, balanceARS: number, balanceUSD: number, dispatch: (...args: unknown[]) => unknown }) => {

    // Monto a comprar formateado
    const formattedAmount = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(amount)
    // Los costos llegan de la API en centavos
    const ars_ask = AL30Data.ars_ask / 100;
    const usd_bid = AL30Data.usd_bid / 100;
    // Precio del bono en USD
    const AL30Price = ars_ask / usd_bid;
    // Redondeamos los títulos a número entero
    const nominals = Math.floor(amount * AL30Price / ars_ask);
    // Costo en ARS
    const ARS_cost = nominals * ars_ask;
    // Compra final de USD
    const finalUSDBuy = ARS_cost / AL30Price;

    const buyMEP = () => {
        // Modificamos el balance en pesos
        dispatch( changeBalanceARS(balanceARS - ARS_cost) )
        // Modificamos el balance en dólares
        dispatch(changeBalanceUSD(balanceUSD + finalUSDBuy) )
        // Modificamos el estado actual de la App para volver a la tarjeta inicial
        dispatch( changeMode('') )
    }
    
    if ( status === 'ready' && amount !== 0 ) return (
        <Fade in appear>
            <Card className='text-center mb-3'>
                <Card.Body>
                    <div><strong>Monto a comprar:</strong> {formattedAmount}</div>
                    <div><strong>Cotización de compra:</strong> {new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(AL30Price)}</div>
                    <div><strong>Bono:</strong> {AL30Data.ticker}</div>
                    <div><strong>Cant. de títulos:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                    <div><strong>Costo de la transacción:</strong> <strong className={ARS_cost > balanceARS ? 'text-danger' : 'text-success'}>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(ARS_cost)}</strong></div>
                    <div><strong>Compra USD final:</strong> <strong className={ARS_cost > balanceARS ? 'text-danger' : 'text-success'}>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(finalUSDBuy)}</strong></div>
                    <small className="text-muted"><strong>Tip: </strong>Puede seguir editando el monto para encontrar nuevos resultados.</small>
                    <div className='mt-2'>
                        <Button variant={'success'} disabled={ARS_cost > balanceARS} onClick={buyMEP}>Comprar</Button>
                    </div>
                </Card.Body>
            </Card>
        </Fade>
    )
    return null;
}

export default function BuyCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch   = useAppDispatch()
    const balanceARS = useAppSelector(selectBalanceARS)
    const balanceUSD = useAppSelector(selectBalanceUSD)

    const [buyAmount, setBuyAmount] = useState(0);
    const [status, setStatus]       = useState<'pending' | 'ready'>('pending');
    const [error, setError]         = useState<string | null>(null);

    const buyAmountHandler = (e:{ target: {value: string}}) => {
        setError(null)
        setBuyAmount(Number(e.target.value))
    }

    const submitHandler = () => {
        setError(null)
        // Validation
        if ( buyAmount === 0 ) return setError('Por favor, seleccione un monto válido.')
        if ( buyAmount < 0 ) return setError('Por favor, seleccione un monto mayor a 0.')
        setStatus('ready')
    }

    return(
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb3'><h4>Compra de Dólar MEP</h4></Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">Calculadora de compra de títulos</Card.Subtitle>

                    <div className='mt-3 d-flex justify-content-around align-items-center'>
                        <h6>Saldo ARS: <strong>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(balanceARS)}</strong></h6>
                    </div>
                    <div className='mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo USD: <strong>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(balanceUSD)}</strong></h6>
                    </div>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong>Monto a comprar</strong></Form.Label>
                            <Form.Control type="number" placeholder="Seleccione monto en USD" onChange={buyAmountHandler}/>
                        </Form.Group>
                    </Form>

                    { error && <div className='text-danger mb-3'>{error}</div> }

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button variant="primary" onClick={submitHandler}>
                            Calcular
                        </Button>
                        <Button variant="light" onClick={() => { dispatch(changeMode('')) }}>
                            Volver
                        </Button>
                    </div>

                    <BuyCalculationResult amount={buyAmount} status={status} AL30Data={AL30Data} balanceARS={balanceARS} balanceUSD={balanceUSD} dispatch={dispatch} />

                </Card.Body>
            </Card>
        </Fade>
    )
}