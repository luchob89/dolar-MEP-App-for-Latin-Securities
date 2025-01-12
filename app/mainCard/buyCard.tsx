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

const BuyCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch }: { amount: number, status: 'pending' | 'ready', AL30Data: AL30Data, balanceARS: number, balanceUSD: number, dispatch: (...args: unknown[]) => unknown }) => {

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal]           = useState(false);

    const closeConfirmationModal = () => setShowConfirmationModal(false);
    const openConfirmationModal = () => setShowConfirmationModal(true);
    const openSuccessModal = () => setShowSuccessModal(true);

    // Monto a comprar formateado
    const formattedAmount = formatUSD(amount)
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
        dispatch(changeBalanceUSD(balanceUSD + finalUSDBuy))
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
                        <div><strong>Cotización de compra:</strong> {formatUSD(AL30Price)}</div>
                        <div><strong>Bono:</strong> {AL30Data.ticker}</div>
                        <div><strong>Cant. de títulos:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                        <div><strong>Costo de la transacción:</strong> <strong className={ARS_cost > balanceARS ? 'text-danger' : 'text-success'}>{formatARS(ARS_cost)}</strong></div>
                        <div><strong>Compra USD final:</strong> <strong className={ARS_cost > balanceARS ? 'text-danger' : 'text-success'}>{formatUSD(finalUSDBuy)}</strong></div>
                        <small className="text-muted"><strong>Tip: </strong>Puede seguir editando el monto para encontrar nuevos resultados.</small>

                        {ARS_cost > balanceARS && <Fade in appear><Alert className='mt-2' variant={'danger'}>Saldo insuficiente. Por favor, elija un monto menor.</Alert></Fade>}

                        <div className='mt-2'>
                            <Button variant={'success'} disabled={ARS_cost > balanceARS} onClick={openConfirmationModal}>Comprar</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Fade>

            <Modal show={showConfirmationModal} onHide={closeConfirmationModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar compra de USD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>¿Desea continuar?</h5>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatARS(balanceARS)}</div>&nbsp; <h4>→</h4> &nbsp;<strong className='text-danger'>{formatARS(balanceARS - ARS_cost)}</strong>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatUSD(balanceUSD)}</div>&nbsp; <h4>→</h4> &nbsp;<strong className='text-success'>{formatUSD(balanceUSD + finalUSDBuy)}</strong>
                    </div>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="success" onClick={buyMEP}>Aceptar</Button>
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

    const allHandler = () => {
        setError(null)
        //setBuyAmount(85)
        //setStatus('ready')
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
                        <h6>Saldo ARS: <strong>{formatARS(balanceARS)}</strong></h6>
                    </div>
                    <div className='mb-1 d-flex justify-content-around align-items-center'>
                        <h6>Saldo USD: <strong>{formatUSD(balanceUSD)}</strong></h6>
                    </div>

                    <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong>Monto a comprar</strong></Form.Label>
                            <Form.Control type="number" placeholder="Seleccione monto en USD" onChange={buyAmountHandler} />
                            <Button className='mt-2' variant='outline-secondary' size='sm' onClick={allHandler}>Comprar todo mi disponible</Button>
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