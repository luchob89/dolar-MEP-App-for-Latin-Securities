import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import { changeBalanceARS, changeBalanceUSD, changeMode, selectBalanceARS, selectBalanceUSD, selectTxsHistory, resetTxsHistory } from "@/features/userDataSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useState } from "react";
import { formatARS, formatUSD } from './mainCard';

export default function ChooseAmounts() {

    const dispatch = useAppDispatch();
    const balanceARS = useAppSelector(selectBalanceARS);
    const balanceUSD = useAppSelector(selectBalanceUSD);
    const txsHistory = useAppSelector(selectTxsHistory);

    const [ARSAmount, setARSAmount] = useState<number | null>(null);
    const [USDAmount, setUSDAmount] = useState<number | null>(null);
    const [resetButtonWasPressed, setResetButtonWasPressed] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const ARSAmountHandler = (e: { target: { value: string } }) => {
        setError(null);
        setARSAmount(Number(e.target.value));
    };

    const USDAmountHandler = (e: { target: { value: string } }) => {
        setError(null);
        setUSDAmount(Number(e.target.value));
    };

    const resetHistory = () => {
        dispatch(resetTxsHistory());
        setResetButtonWasPressed(true);
    }

    const submitInputValues = () => {
        setError(null);
        // Validation
        if (!ARSAmount) return setError('Por favor, seleccione un monto en ARS válido.')
        if (!USDAmount) return setError('Por favor, seleccione un monto en USD válido.')
        if (ARSAmount <= 0 || USDAmount <= 0) return setError('Por favor, seleccione montos mayores a 0.')
        // Set and 'redirect'
        dispatch(changeBalanceARS(ARSAmount));
        dispatch(changeBalanceUSD(USDAmount));
        dispatch(changeMode(''));
    };

    const submitDefault = () => {
        dispatch(changeMode(''));
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
                    <Card.Subtitle className='mb-3'>
                        Por favor, elija saldos iniciales:
                    </Card.Subtitle>

                        <Form onSubmit={e => { e.preventDefault(); submitInputValues(); }}>
                            <Form.Group className="mb-3">
                            <Form.Label><strong className='color-blue'>Saldo ARS</strong></Form.Label>
                            <Form.Control className='text-center' type="number" placeholder="Seleccione monto en ARS" onChange={ARSAmountHandler} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong className='color-blue'>Saldo USD</strong></Form.Label>
                            <Form.Control className='text-center' type="number" placeholder="Seleccione monto en USD" onChange={USDAmountHandler} />
                        </Form.Group>
                    </Form>

                    {error && <div className='text-danger mb-3'>{error}</div>}

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button className='w-100' variant="custom1" onClick={submitInputValues}>
                            Continuar
                        </Button>
                    </div>

                    <div className='w-100 separator'/>

                    <Card.Subtitle className="mt-4 mb-3">O continúe con los valores predeterminados:</Card.Subtitle>
                    <div className='mt-3 mb-1 d-flex justify-content-center align-items-center'>
                        <h6><strong>Saldo ARS: </strong>{formatARS(balanceARS)}</h6>
                    </div>
                    <div className='mt-1 mb-3 d-flex justify-content-center align-items-center'>
                        <h6><strong>Saldo USD:</strong> {formatUSD(balanceUSD)}</h6>
                    </div>

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button className='w-100' variant="custom2" onClick={submitDefault}>
                            Continuar
                        </Button>
                    </div>

                    {txsHistory.length > 0 && (
                        <>
                            <div className='w-100 separator'/>
                            <div className="d-flex gap-2 mb-2 mt-4 justify-content-center">
                                <Button variant="danger" onClick={resetHistory}>
                                    Borrar Historial
                                </Button>
                            </div>
                        </>
                    )}

                    {resetButtonWasPressed && (
                        <>
                            <div className='w-100 separator' />
                            <Alert variant={'success'} className='mb-2 mt-4'>Historial borrado.</Alert>
                        </>
                    )}

                </Card.Body>
            </Card>
        </Fade>
        </>
    );
}