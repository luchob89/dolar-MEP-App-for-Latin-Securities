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

    const submitHandler = () => {
        setError(null);
        // Validation if user inputs numbers
        if (typeof ARSAmount === 'number' && typeof USDAmount === 'number') {
            if (ARSAmount === 0 || USDAmount === 0) return setError('Por favor, seleccione un monto válido.')
            if (ARSAmount < 0 || USDAmount < 0) return setError('Por favor, seleccione montos mayores a 0.')
            // Overwrite the default values with the user input
            dispatch(changeBalanceARS(ARSAmount));
            dispatch(changeBalanceUSD(USDAmount));
        }
        // If the user leaves the fields empty, the default values will be used
        dispatch(changeMode(''));
    };

    return (
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb-3'>
                        Por favor, elija saldos iniciales:
                    </Card.Title>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler(); }}>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Saldo ARS</strong></Form.Label>
                            <Form.Control className='text-center' type="number" placeholder="Seleccione monto en ARS" onChange={ARSAmountHandler} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Saldo USD</strong></Form.Label>
                            <Form.Control className='text-center' type="number" placeholder="Seleccione monto en USD" onChange={USDAmountHandler} />
                        </Form.Group>
                    </Form>

                    {error && <div className='text-danger mb-3'>{error}</div>}

                    <Card.Subtitle className="mb-3 text-muted">O continúe con los valores predeterminados:</Card.Subtitle>
                    <div className='mt-3 mb-1 d-flex justify-content-center align-items-center'>
                        <h6>Saldo ARS: <strong>{formatARS(balanceARS)}</strong></h6>
                    </div>
                    <div className='mt-1 mb-3 d-flex justify-content-center align-items-center'>
                        <h6>Saldo USD: <strong>{formatUSD(balanceUSD)}</strong></h6>
                    </div>

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button variant="primary" onClick={submitHandler}>
                            Continuar
                        </Button>
                    </div>

                    {txsHistory.length > 0 && (
                    <div className="d-flex gap-2 mb-2 justify-content-center">
                            <Button variant="warning" onClick={resetHistory}>
                            Borrar Historial
                        </Button>
                    </div>)}

                    {resetButtonWasPressed && <Alert variant={'success'} className='mb-3'>Historial borrado.</Alert>}

                </Card.Body>
            </Card>
        </Fade>
    );
}