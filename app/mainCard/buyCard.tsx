import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeMode, selectBalanceARS, selectBalanceUSD } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard'
import { BuyCalculationResult } from './BuyCalculationResult';
export default function BuyCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch   = useAppDispatch()
    const balanceARS = useAppSelector(selectBalanceARS)
    const balanceUSD = useAppSelector(selectBalanceUSD)

    // Los costos llegan de la API en centavos
    const ars_ask = AL30Data.ars_ask / 100;
    const usd_bid = AL30Data.usd_bid / 100;
    // Precio del bono en USD
    const AL30Price = ars_ask / usd_bid;

    const [buyAmount, setBuyAmount] = useState(0);
    const [status, setStatus]       = useState<'pending' | 'ready'>('pending');
    const [error, setError]         = useState<string | null>(null);

    const buyAmountHandler = (e:{ target: {value: string}}) => {
        setError(null)
        setBuyAmount(Number(e.target.value))
    }

    const allHandler = () => {
        setError(null)
        setBuyAmount(balanceARS / AL30Price)
        setStatus('ready')
    }

    const submitHandler = () => {
        setError(null)
        // Validation
        if ( buyAmount === 0 ) return setError('Por favor, seleccione un monto válido.')
        if ( buyAmount < 0 ) return setError('Por favor, seleccione un monto mayor a 0.')
        setStatus('ready')
    }

    return (
        <>
        <style type="text/css">
        {`
            .btn-custom1 {
              background-color: #000039;
              color: white;
            }
            .btn-custom1:hover {
              background-color: #000029;
              color: white;
            }
            .btn-custom2 {
              background-color: rgb(51, 151, 244);
              color: white;
            }
            .btn-custom2:hover {
              background-color: rgb(51, 121, 800);
              color: white;
            }
        `}
        </style>
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb3'><h4>Compra de Dólar MEP</h4></Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">Calculadora de compra de títulos</Card.Subtitle>

                    <div className='mt-3 d-flex justify-content-around align-items-center'>
                        <h6>Saldo ARS: <strong>{formatARS(balanceARS)}</strong></h6>
                    </div>
                    <div className='mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo USD: <strong>{formatUSD(balanceUSD)}</strong></h6>
                    </div>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong className='color-blue'>Monto a comprar</strong></Form.Label>
                            <Form.Control type="number" className='text-center' placeholder="Seleccione monto en USD" onChange={buyAmountHandler} />
                            <Button className='w-100 mt-3 mb-2' variant='custom1' size='sm' onClick={allHandler}>Comprar todo mi disponible</Button>
                        </Form.Group>
                    </Form>

                    { error && <div className='text-danger mb-3'>{error}</div> }

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button variant="custom2" className='w-100' onClick={submitHandler}>
                            Calcular
                        </Button>
                        <Button variant="light" className='w-100' onClick={() => { dispatch(changeMode('')) }}>
                            Volver
                        </Button>
                    </div>

                    <BuyCalculationResult
                        amount={buyAmount}
                        status={status}
                        AL30Data={AL30Data}
                        balanceARS={balanceARS}
                        balanceUSD={balanceUSD}
                        dispatch={dispatch}
                        ars_ask={ars_ask}
                        AL30Price={AL30Price}
                    />

                </Card.Body>
            </Card>
        </Fade>
        </>
    )
}