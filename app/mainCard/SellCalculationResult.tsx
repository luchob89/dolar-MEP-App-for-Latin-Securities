import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { changeBalanceARS, changeBalanceUSD, changeMode, addTxRegistry } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard';

export const SellCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch }: { amount: number; status: 'pending' | 'ready'; AL30Data: AL30Data; balanceARS: number; balanceUSD: number; dispatch: (...args: unknown[]) => unknown; }) => {

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const closeConfirmationModal = () => setShowConfirmationModal(false);
    const openConfirmationModal = () => setShowConfirmationModal(true);
    const openSuccessModal = () => setShowSuccessModal(true);
    const closeSuccessModal = () => {
        // Obtenemos la fecha actual
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        // Modificamos el balance en pesos
        dispatch(changeBalanceARS(balanceARS + ARSToGet));
        // Modificamos el balance en dólares
        dispatch(changeBalanceUSD(balanceUSD - USD_cost));
        // Agregamos el registro al historial de transacciones
        dispatch(addTxRegistry({ type: 'sell', amount: USD_cost, date: date.toLocaleDateString(undefined, options), price: AL30Price, pre: balanceUSD, post: balanceUSD - USD_cost }))
        // Volvemos a la pantalla principal
        dispatch(changeMode(''))
    }

    // Monto a vender formateado
    const formattedAmount = formatUSD(amount);
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
        // Ocultamos el modal de confirmación
        closeConfirmationModal();
        // Mostramos el modal de éxito de la operación
        openSuccessModal();
    };

    // Condición para mostrar mensaje de error y deshabilitar botón de acción
    const showError = USD_cost > balanceUSD || nominals === 0 ? true : false;

    if (status === 'ready' && amount !== 0) return (
        <>
            <Fade in appear>
                <Card className='text-center mb-3'>
                    <Card.Body>
                        <div><strong>Monto a vender:</strong> {formattedAmount}</div>
                        <div><strong>Cotización de venta:</strong> {formatUSD(AL30Price)}</div>
                        <div><strong>Bono:</strong> {AL30Data.ticker}D</div>
                        <div><strong>Cant. de títulos:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                        <div><strong>Monto a debitar en USD:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatUSD(USD_cost)}</strong></div>
                        <div><strong>Compra ARS final:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatARS(ARSToGet)}</strong></div>
                        <small className="text-muted"><strong>Tip: </strong>Puede seguir editando el monto para encontrar nuevos resultados.</small>

                        {showError && <Fade in appear><Alert className='mt-2' variant={'danger'}>Saldo insuficiente. Por favor, elija un monto menor.</Alert></Fade>}

                        <div className='mt-2'>
                            <Button variant={'danger'} disabled={showError} onClick={openConfirmationModal}>Vender</Button>
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

            <Modal show={showSuccessModal} onHide={closeSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Exito!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>La operación fue realizada correctamente.</h5>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="primary" onClick={closeSuccessModal}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
    return null;
};
