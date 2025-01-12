import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeMode, selectBalanceARS } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';

const BuyResult = ({ amount, status, AL30Data }: { amount: number, status: 'pending' | 'ready', AL30Data: AL30Data }) => {
    
    if ( status === 'ready' && amount !== 0 ) {

        let AL30Price = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(AL30Data.ars_ask / AL30Data.usd_bid);

        // Operación para determinar cuántos títulos pueden ser comprados con el monto que declaró el usuario. Declaración y formateo
        let nominals = new Intl.NumberFormat("de-DE").format(1)
        // Monto formateado
        let formattedAmount = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(amount)

        return (
            <Fade in appear>
                <Card className='text-center mb-3'>
                    <Card.Body>
                        <div><strong>Precio del título:</strong> {AL30Price}</div>
                        <div><strong>Monto a comprar:</strong> {formattedAmount}</div>
                        <Alert className='mt-2' variant={'success'}><strong>Cant. de nominales:</strong> {nominals}</Alert>
                        <small className="text-muted"><strong>Tip: </strong>Puede seguir editando los campos para encontrar nuevos resultados.</small>
                    </Card.Body>
                </Card>
            </Fade>
        )
    }
    return null;
}

export default function BuyCard({ AL30Data }: { AL30Data: AL30Data }) {

    const dispatch   = useAppDispatch()
    const balanceARS = useAppSelector(selectBalanceARS)

    const [buyAmount, setBuyAmount] = useState(0);
    const [status, setStatus]       = useState<'pending' | 'ready'>('pending');
    const [error, setError]         = useState<string | null>(null);

    const buyAmountHandler = (e:{ target: {value: string}}) => {
        setError(null)
        return setBuyAmount(Number(e.target.value))
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

                    <div className='mt-3 mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo: {new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS", currencyDisplay: 'code' }).format(balanceARS)}</h6>
                    </div>

                    <Form onSubmit={ e => e.preventDefault() }>
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

                    <BuyResult amount={buyAmount} status={status} AL30Data={AL30Data} />

                </Card.Body>
            </Card>
        </Fade>
    )
}