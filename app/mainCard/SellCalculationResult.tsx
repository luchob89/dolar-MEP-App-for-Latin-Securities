import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { changeBalanceARS, changeBalanceUSD, changeMode, addTxRegistry } from '@/features/userDataSlice';
import { AL30Data } from '../page';
import { useState } from 'react';
import { formatARS, formatUSD } from './mainCard';

export const SellCalculationResult = ({ amount, status, AL30Data, balanceARS, balanceUSD, dispatch, selectedLangObject }: { amount: number; status: 'pending' | 'ready'; AL30Data: AL30Data; balanceARS: number; balanceUSD: number; dispatch: (...args: unknown[]) => unknown; selectedLangObject: { [k: string]: string } }) => {

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

    function simulateNetworkRequest() {
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    const sellMEP = () => {
        setLoading(true)
        simulateNetworkRequest().then(() => {
            // Ocultamos el modal de confirmación
            closeConfirmationModal();
            // Mostramos el modal de éxito de la operación
            openSuccessModal();
        });
    };

    // Condición para mostrar mensaje de error y deshabilitar botón de acción
    const showError = USD_cost > balanceUSD || nominals <= 0 ? true : false;

    if (status === 'ready' && amount !== 0) return (
        <>
            <Fade in appear>
                <div className='mt-4 tx-data-container'>
                    <div><strong>{selectedLangObject.monto_vender}:</strong> {formattedAmount}</div>
                    <div><strong>{selectedLangObject.cotizacion_venta}:</strong> {formatUSD(AL30Price)}</div>
                    <div><strong>{selectedLangObject.bono}:</strong> {AL30Data.ticker}D</div>
                    <div><strong>{selectedLangObject.cant_titulos}:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                    <div><strong>{selectedLangObject.monto_debitar_USD}:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatUSD(USD_cost)}</strong></div>
                    <div className='mb-3'><strong>{selectedLangObject.compra_ARS_final}:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatARS(ARSToGet)}</strong></div>
                    
                    {showError && <Alert className='mt-2' variant={'danger'}>{selectedLangObject.saldo_insuficiente}</Alert>}

                    <small className="text-muted"><strong>Tip: </strong>{selectedLangObject.tip}</small>

                    <div className='mt-2'>
                        <Button className='w-100' variant={'danger'} disabled={showError} onClick={openConfirmationModal}>{selectedLangObject.vender}</Button>
                    </div>
                </div>
            </Fade>

            <Modal show={showConfirmationModal} onHide={closeConfirmationModal} centered>
                <Modal.Header closeButton className='noBorderBottom'>
                    <Modal.Title>{selectedLangObject.confirmar_venta}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>{selectedLangObject.desea_continuar}</h5>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatARS(balanceARS)}</div>&nbsp; → &nbsp;<strong className='text-success'>{formatARS(balanceARS + ARSToGet)}</strong>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-decoration-line-through'>{formatUSD(balanceUSD)}</div>&nbsp; → &nbsp;<strong className='text-danger'>{formatUSD(balanceUSD - USD_cost)}</strong>
                    </div>
                </Modal.Body>
                <Modal.Footer className='justify-content-center noBorderTop'>
                    <Button variant="danger" disabled={isLoading} onClick={sellMEP}>{isLoading ? <Spinner animation="border" size="sm" variant="light" /> : selectedLangObject.aceptar}</Button>
                    {!isLoading && <Button variant="secondary" disabled={isLoading} onClick={closeConfirmationModal}>{selectedLangObject.cancelar}</Button>}
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={closeSuccessModal} centered>
                <Modal.Header closeButton className='noBorderBottom'>
                    <Modal.Title className='text-success fw-bolder'>{selectedLangObject.exito}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center text-success'>{selectedLangObject.operacion_realizada}</h5>
                </Modal.Body>
                <Modal.Footer className='justify-content-center noBorderTop'>
                    <Button variant="success" onClick={closeSuccessModal}>{selectedLangObject.aceptar}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
    return null;
};
