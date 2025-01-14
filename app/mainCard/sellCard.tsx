import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeMode, selectBalanceARS, selectBalanceUSD } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard'
import { SellCalculationResult } from './SellCalculationResult';

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

    const allHandler = () => {
        setError(null)
        setSellAmount(balanceUSD)
        setStatus('ready')
    }

    const submitHandler = () => {
        setError(null)
        // Validation
        if (sellAmount === 0) return setError('Por favor, seleccione un monto válido.')
        if (sellAmount < 0) return setError('Por favor, seleccione un monto mayor a 0.')
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
                    <Card.Title className='mb3'> <h4>Venta de Dólar MEP</h4> </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">Calculadora de venta de títulos</Card.Subtitle>

                    <div className='mt-3 d-flex justify-content-around align-items-center'>
                        <h6>Saldo ARS: <strong>{formatARS(balanceARS)}</strong></h6>
                    </div>
                    <div className='mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo USD: <strong>{formatUSD(balanceUSD)}</strong></h6>
                    </div>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong className='color-blue'>Monto a vender</strong></Form.Label>
                            <Form.Control type="number" className='text-center' placeholder="Seleccione monto en USD" onChange={sellAmountHandler} />
                            <Button className='w-100 mt-3 mb-2' variant='custom1' size='sm' onClick={allHandler}>Vender todo mi disponible</Button>
                        </Form.Group>
                    </Form>

                    {error && <div className='text-danger mb-3'>{error}</div>}

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button variant="custom2" className='w-100' onClick={submitHandler}>
                            Calcular
                        </Button>
                        <Button variant="light" className='w-100' onClick={() => { dispatch(changeMode('')) }}>
                            Volver
                        </Button>
                    </div>

                    <SellCalculationResult amount={sellAmount} status={status} AL30Data={AL30Data} balanceARS={balanceARS} balanceUSD={balanceUSD} dispatch={dispatch} />

                </Card.Body>
            </Card>
        </Fade>
        </>
    )
}