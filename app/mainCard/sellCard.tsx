import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeBalanceARS, changeBalanceUSD, changeMode, selectBalanceARS, selectBalanceUSD } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';

const SellCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch }: { amount: number, status: 'pending' | 'ready', AL30Data: AL30Data, balanceARS: number, balanceUSD: number, dispatch: Function }) => {

    // Monto a vender formateado
    const formattedAmount = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(amount)
    // Los costos llegan de la API en centavos
    const usd_ask = AL30Data.usd_ask / 100;
    const ars_bid = AL30Data.ars_bid / 100;
    // Precio del bono en USD
    const AL30Price = ars_bid / usd_ask;
    // Redondeamos los títulos a número entero
    const nominals = Math.floor(amount / usd_ask);
    // Costo en USD
    const USD_cost = nominals * usd_ask;
    // Compra final de USD
    const ARSToGet = nominals * ars_bid;

    const sellMEP = () => {
        // Modificamos el balance en pesos
        dispatch( changeBalanceARS(balanceARS + ARSToGet) )
        // Modificamos el balance en dólares
        dispatch( changeBalanceUSD(balanceUSD - USD_cost) )
        // Modificamos el estado actual de la App para volver a la tarjeta inicial
        dispatch( changeMode('') )
    }

    if (status === 'ready' && amount !== 0) return (
        <Fade in appear>
            <Card className='text-center mb-3'>
                <Card.Body>
                    <div><strong>Monto a comprar:</strong> {formattedAmount}</div>
                    <div><strong>Cotización de venta:</strong> {new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(AL30Price)}</div>
                    <div><strong>Bono:</strong> {AL30Data.ticker}D</div>
                    <div><strong>Cant. de títulos:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                    <div><strong>Costo de la transacción:</strong> <strong className={USD_cost > balanceUSD ? 'text-danger' : 'text-success'}>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(USD_cost)}</strong></div>
                    <div><strong>Compra ARS final:</strong> <strong className={USD_cost > balanceUSD ? 'text-danger' : 'text-success'}>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(ARSToGet)}</strong></div>
                    <small className="text-muted"><strong>Tip: </strong>Puede seguir editando el monto para encontrar nuevos resultados.</small>
                    <div className='mt-2'>
                        <Button variant={'danger'} disabled={USD_cost > balanceUSD} onClick={sellMEP}>Vender</Button>
                    </div>
                </Card.Body>
            </Card>
        </Fade>
    )
    return null;
}

export default function SellCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch   = useAppDispatch()
    const balanceARS = useAppSelector(selectBalanceARS)
    const balanceUSD = useAppSelector(selectBalanceUSD)

    const [sellAmount, setSellAmount]   = useState(0);
    const [status, setStatus]           = useState<'pending' | 'ready'>('pending');
    const [error, setError]             = useState<string | null>(null);

    const sellAmountHandler = (e: { target: { value: string } }) => {
        setError(null)
        setSellAmount(Number(e.target.value))
    }

    const submitHandler = () => {
        setError(null)
        // Validation
        if (sellAmount === 0) return setError('Por favor, seleccione un monto válido.')
        if (sellAmount < 0) return setError('Por favor, seleccione un monto mayor a 0.')
        setStatus('ready')
    }

    return (
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb3'> <h4>Venta de Dólar MEP</h4> </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">Calculadora de venta de títulos</Card.Subtitle>

                    <div className='mt-3 d-flex justify-content-around align-items-center'>
                        <h6>Saldo ARS: <strong>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(balanceARS)}</strong></h6>
                    </div>
                    <div className='mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo USD: <strong>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(balanceUSD)}</strong></h6>
                    </div>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong>Monto a vender</strong></Form.Label>
                            <Form.Control type="number" placeholder="Seleccione monto en USD" onChange={sellAmountHandler} />
                        </Form.Group>
                    </Form>

                    {error && <div className='text-danger mb-3'>{error}</div>}

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button variant="primary" onClick={submitHandler}>
                            Calcular
                        </Button>
                        <Button variant="light" onClick={() => { dispatch(changeMode('')) }}>
                            Volver
                        </Button>
                    </div>

                    <SellCalculationResult amount={sellAmount} status={status} AL30Data={AL30Data} balanceARS={balanceARS} balanceUSD={balanceUSD} dispatch={dispatch} />

                </Card.Body>
            </Card>
        </Fade>
    )
}