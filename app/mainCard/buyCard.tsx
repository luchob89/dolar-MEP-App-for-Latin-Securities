import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import InputGroup from 'react-bootstrap/InputGroup';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeMode, selectBalanceARS, selectBalanceUSD } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard'
import { BuyCalculationResult } from './BuyCalculationResult';
export default function BuyCard({ AL30Data, selectedLangObject }: { AL30Data: AL30Data, selectedLangObject: { [k: string]: string } }) {

    const dispatch   = useAppDispatch()
    const balanceARS = useAppSelector(selectBalanceARS)
    const balanceUSD = useAppSelector(selectBalanceUSD)

    // Prices get from AL30Data come in cents, so we divide by 100 to get the real price.
    const ars_ask = AL30Data.ars_ask / 100;
    const usd_bid = AL30Data.usd_bid / 100;
    // Bond price in USD
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
        if ( buyAmount === 0 ) return setError(selectedLangObject.monto_valido)
        if ( buyAmount < 0 ) return setError(selectedLangObject.un_monto_positivo)
        if ( buyAmount > 100000000 ) return setError(selectedLangObject.monto_menor)
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
                    <Card.Title className='mb3'><h4>{selectedLangObject.compraMEP}</h4></Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">{selectedLangObject.calculadora_compra}</Card.Subtitle>

                    <div className='mt-3 d-flex justify-content-around align-items-center'>
                        <h6>{selectedLangObject.saldoARS}: <strong>{formatARS(balanceARS)}</strong></h6>
                    </div>
                    <div className='mb-1 d-flex justify-content-around align-items-center'>
                        <h6>{selectedLangObject.saldoUSD}: <strong>{formatUSD(balanceUSD)}</strong></h6>
                    </div>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong className='color-blue'>{selectedLangObject.monto_comprar}</strong></Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>US$</InputGroup.Text>
                                <Form.Control placeholder={selectedLangObject.seleccioneUSD} type="number" max={"100000000"} aria-label={selectedLangObject.seleccioneUSD} onChange={buyAmountHandler} />
                            </InputGroup>
                            <Button className='w-100 mt-3 mb-2' variant='custom1' size='sm' onClick={allHandler}>{selectedLangObject.comprar_disponible}</Button>
                        </Form.Group>
                    </Form>

                    { error && <div className='text-danger mb-3' style={{whiteSpace: 'pre-line'}}>{error}</div> }

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button variant="custom2" className='w-100' onClick={submitHandler}>
                            {selectedLangObject.calcular}
                        </Button>
                        <Button variant="light" className='w-100' onClick={() => { dispatch(changeMode('')) }}>
                            {selectedLangObject.volver}
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
                        selectedLangObject={selectedLangObject}
                    />

                </Card.Body>
            </Card>
        </Fade>
        </>
    )
}