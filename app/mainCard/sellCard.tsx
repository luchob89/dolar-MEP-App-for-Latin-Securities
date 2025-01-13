import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { changeBalanceARS, changeBalanceUSD, changeMode, selectBalanceARS, selectBalanceUSD } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard'

const SellCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch }: { amount: number, status: 'pending' | 'ready', AL30Data: AL30Data, balanceARS: number, balanceUSD: number, dispatch: (...args: unknown[]) => unknown }) => {

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const closeConfirmationModal = () => setShowConfirmationModal(false);
    const openConfirmationModal = () => setShowConfirmationModal(true);
    const openSuccessModal = () => setShowSuccessModal(true);

    // Monto a vender formateado
    const formattedAmount = formatUSD(amount)
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
        dispatch(changeBalanceUSD(balanceUSD - USD_cost))
        // Ocultamos el modal de confirmación
        closeConfirmationModal()
        // Mostramos el modal de éxito de la operación
        openSuccessModal()
    }

    if (status === 'ready' && amount !== 0) return (
        <>
            <Fade in appear>
                <Card className='text-center mb-3'>
                    <Card.Body>
                        <div><strong>Monto a comprar:</strong> {formattedAmount}</div>
                        <div><strong>Cotización de venta:</strong> {formatUSD(AL30Price)}</div>
                        <div><strong>Bono:</strong> {AL30Data.ticker}D</div>
                        <div><strong>Cant. de títulos:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                        <div><strong>Costo de la transacción:</strong> <strong className={USD_cost > balanceUSD ? 'text-danger' : 'text-success'}>{formatUSD(USD_cost)}</strong></div>
                        <div><strong>Compra ARS final:</strong> <strong className={USD_cost > balanceUSD ? 'text-danger' : 'text-success'}>{formatARS(ARSToGet)}</strong></div>
                        <small className="text-muted"><strong>Tip: </strong>Puede seguir editando el monto para encontrar nuevos resultados.</small>

                        {USD_cost > balanceUSD || nominals === 0 && <Fade in appear><Alert className='mt-2' variant={'danger'}>Saldo insuficiente. Por favor, elija un monto menor.</Alert></Fade>}

                        <div className='mt-2'>
                            <Button variant={'danger'} disabled={USD_cost > balanceUSD || nominals === 0} onClick={openConfirmationModal}>Vender</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Fade>

            <Modal show={showConfirmationModal} onHide={closeConfirmationModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar venta de USD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>¿Desea continuar?</h5>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatARS(balanceARS)}</div>&nbsp; <h4>→</h4> &nbsp;<strong className='text-success'>{formatARS(balanceARS + ARSToGet)}</strong>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatUSD(balanceUSD)}</div>&nbsp; <h4>→</h4> &nbsp;<strong className='text-danger'>{formatUSD(balanceUSD - USD_cost)}</strong>
                    </div>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="danger" onClick={sellMEP}>Aceptar</Button>
                    <Button variant="secondary" onClick={closeConfirmationModal}>Cancelar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={() => dispatch(changeMode(''))} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Exito!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>La operación fue realizada correctamente.</h5>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="primary" onClick={() => dispatch(changeMode(''))}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </>
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
                            <Form.Label><strong>Monto a vender</strong></Form.Label>
                            <Form.Control type="number" placeholder="Seleccione monto en USD" onChange={sellAmountHandler} />
                            <Button className='mt-2' variant='outline-secondary' size='sm' onClick={allHandler}>Comprar todo mi disponible</Button>
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