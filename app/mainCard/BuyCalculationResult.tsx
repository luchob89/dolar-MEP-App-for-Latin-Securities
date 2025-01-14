﻿import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { changeBalanceARS, changeBalanceUSD, changeMode, addTxRegistry } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard';

export const BuyCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch, ars_ask, AL30Price }: { amount: number; status: 'pending' | 'ready'; AL30Data: AL30Data; balanceARS: number; balanceUSD: number; dispatch: (...args: unknown[]) => unknown; ars_ask: number; AL30Price: number; }) => {

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const closeConfirmationModal = () => setShowConfirmationModal(false);
    const openConfirmationModal = () => setShowConfirmationModal(true);
    const openSuccessModal = () => setShowSuccessModal(true);
    const closeSuccessModal = () => {
        // Obtenemos la fecha actual
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour12: false,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        // Modificamos el balance en pesos
        dispatch(changeBalanceARS(balanceARS - ARS_cost));
        // Modificamos el balance en dólares
        dispatch(changeBalanceUSD(balanceUSD + finalUSDBuy));
        // Agregamos el registro al historial de transacciones
        dispatch(addTxRegistry({ type: 'buy', amount: finalUSDBuy, date: date.toLocaleDateString(undefined, options), price: AL30Price, pre: balanceARS, post: balanceARS - ARS_cost }))
        // Volvemos a la pantalla principal
        dispatch(changeMode(''));
    }

    // Monto a comprar formateado
    const formattedAmount = formatUSD(amount);
    // Redondeamos los títulos a número entero
    const nominals = Math.floor(amount * AL30Price / ars_ask);
    // Costo en ARS
    const ARS_cost = nominals * ars_ask;
    // Compra final de USD
    const finalUSDBuy = ARS_cost / AL30Price;

    function simulateNetworkRequest() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    const buyMEP = () => {
        setLoading(true)
        simulateNetworkRequest().then(() => {
            // Ocultamos el modal de confirmación
            closeConfirmationModal();
            // Mostramos el modal de éxito de la operación
            openSuccessModal();
        });
    };

    // Condición para mostrar mensaje de error y deshabilitar botón de acción
    const showError = ARS_cost > balanceARS || nominals === 0 ? true : false;

    if (status === 'ready' && amount !== 0) return (
        <>
            <Fade in appear>
                <div className='mt-4 tx-data-container'>
                    <div><strong>Monto a comprar:</strong> {formattedAmount}</div>
                    <div><strong>Cotización de compra:</strong> {formatUSD(AL30Price)}</div>
                    <div><strong>Bono:</strong> {AL30Data.ticker}</div>
                    <div><strong>Cant. de títulos:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                    <div><strong>Monto a acreditar en ARS:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatARS(ARS_cost)}</strong></div>
                    <div className='mb-3'><strong>Compra USD final:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatUSD(finalUSDBuy)}</strong></div>

                    {showError && <Alert className='mt-2' variant={'danger'}>Saldo insuficiente. Por favor, elija un monto menor.</Alert>}

                    <small className="text-muted"><strong>Tip: </strong>Puede seguir editando el monto para encontrar nuevos resultados.</small>

                    <div className='mt-2'>
                        <Button className='w-100' variant={'success'} disabled={showError} onClick={openConfirmationModal}>Comprar</Button>
                    </div>
                </div>
            </Fade>

            <Modal show={showConfirmationModal} onHide={closeConfirmationModal} centered>
                <Modal.Header closeButton className='noBorderBottom'>
                    <Modal.Title>Confirmar compra de USD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>¿Desea continuar?</h5>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatARS(balanceARS)}</div>&nbsp; → &nbsp;<strong className='text-danger'>{formatARS(balanceARS - ARS_cost)}</strong>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatUSD(balanceUSD)}</div>&nbsp; → &nbsp;<strong className='text-success'>{formatUSD(balanceUSD + finalUSDBuy)}</strong>
                    </div>
                </Modal.Body>
                <Modal.Footer className='justify-content-center noBorderTop'>
                    <Button variant="success" disabled={isLoading} onClick={buyMEP}>{isLoading ? <Spinner animation="border" size="sm" variant="light" /> : 'Aceptar'}</Button>
                    {!isLoading && <Button variant="secondary" disabled={isLoading} onClick={closeConfirmationModal}>Cancelar</Button>}
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={closeSuccessModal} centered>
                <Modal.Header closeButton className='noBorderBottom'>
                    <Modal.Title className='text-success fw-bolder'>Éxito!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center text-success'>La operación fue realizada correctamente.</h5>
                </Modal.Body>
                <Modal.Footer className='justify-content-center noBorderTop'>
                    <Button variant="success" onClick={closeSuccessModal}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
    return null;
};
