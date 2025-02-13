
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { changeBalanceARS, changeBalanceUSD, addTxRegistry } from '@/lib/userDataSlice';
import { useState } from 'react';
import { formatARS, formatUSD } from '@/features/amountsFormatFx';
import { AL30DataType } from '@/features/getAL30Data';
import { useRouter } from 'next/navigation';

export const BuyCalculationResult = (
  { amount, status, AL30Data, balanceARS, balanceUSD, dispatch, ars_ask, AL30Price, selectedLangObject }: 
  { amount: number; status: 'pending' | 'ready'; AL30Data: AL30DataType; balanceARS: number; balanceUSD: number; dispatch: (...args: unknown[]) => unknown; ars_ask: number; AL30Price: number; selectedLangObject: { [k: string]: string } }) => {

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // Router Hook for client side navigation
  const router = useRouter()

  const closeConfirmationModal = () => setShowConfirmationModal(false);
  const openConfirmationModal = () => setShowConfirmationModal(true);
  const openSuccessModal = () => setShowSuccessModal(true);
  const closeSuccessModal = () => {
      // Current Date
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
      // Modify ARS balance
      dispatch(changeBalanceARS(balanceARS - ARS_cost));
      // Modify USD balance
      dispatch(changeBalanceUSD(balanceUSD + finalUSDBuy));
      // Add transaction to history
      dispatch(addTxRegistry({ type: 'buy', amount: finalUSDBuy, date: date.toLocaleDateString(undefined, options), price: AL30Price, pre: balanceARS, post: balanceARS - ARS_cost }))
      // Back to mainCard
      router.push('/mainCard')
  }

  // Formatted amount to buy
  const formattedAmount = formatUSD(amount);
  // Round nominals down to nearest integer
  const nominals = Math.floor(amount * AL30Price / ars_ask);
  // Cost in ARS
  const ARS_cost = nominals * ars_ask;
  // Final USD buy
  const finalUSDBuy = ARS_cost / AL30Price;

  // Simulate network request to "save" the transaction on a DB
  function simulateNetworkRequest() {
      return new Promise(resolve => {
          setTimeout(resolve, 500);
      });
  }

  const buyMEP = () => {
      setLoading(true)
      simulateNetworkRequest().then( () => {
          // Close confirmation modal
          closeConfirmationModal();
          // Open success modal
          openSuccessModal();
      });
  };

  // Condition to show error message and disable action button
  const showError = (ARS_cost > balanceARS || nominals === 0) && !showSuccessModal ? true : false;

  if (status === 'ready' && amount !== 0) return (
      <>
          <Fade in appear>
              <div className='mt-4 tx-data-container'>
                  <div><strong>{selectedLangObject.monto_comprar}:</strong> {formattedAmount}</div>
                  <div><strong>{selectedLangObject.cotizacion_compra}:</strong> {formatUSD(AL30Price)}</div>
                  <div><strong>{selectedLangObject.bono}:</strong> {AL30Data.ticker}</div>
                  <div><strong>{selectedLangObject.cant_titulos}:</strong> {new Intl.NumberFormat("de-DE").format(nominals)}</div>
                  <div><strong>{selectedLangObject.monto_acreditar_ARS}:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatARS(ARS_cost)}</strong></div>
                  <div className='mb-3'><strong>{selectedLangObject.compra_USD_final}:</strong> <strong className={showError ? 'text-danger' : 'text-success'}>{formatUSD(finalUSDBuy)}</strong></div>

                  {showError && <Alert className='mt-2' variant={'danger'}>{selectedLangObject.saldo_insuficiente}</Alert>}

                  <small className="text-muted"><strong>Tip: </strong>{selectedLangObject.tip}</small>

                  <div className='mt-2'>
                      <Button className='w-100' variant={'success'} disabled={showError} onClick={openConfirmationModal}>{selectedLangObject.comprar}</Button>
                  </div>
              </div>
          </Fade>

          <Modal show={showConfirmationModal} onHide={closeConfirmationModal} centered>
              <Modal.Header closeButton className='noBorderBottom'>
                  <Modal.Title>{selectedLangObject.confirmar_compra}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <h5 className='text-center'>{selectedLangObject.desea_continuar}</h5>
                  <div className='d-flex justify-content-center align-items-center'>
                      <div className='text-decoration-line-through'>{formatARS(balanceARS)}</div>&nbsp; → &nbsp;<strong className='text-danger'>{formatARS(balanceARS - ARS_cost)}</strong>
                  </div>
                  <div className='d-flex justify-content-center align-items-center'>
                      <div className='text-decoration-line-through'>{formatUSD(balanceUSD)}</div>&nbsp; → &nbsp;<strong className='text-success'>{formatUSD(balanceUSD + finalUSDBuy)}</strong>
                  </div>
              </Modal.Body>
              <Modal.Footer className='justify-content-center noBorderTop'>
                  <Button variant="success" disabled={isLoading} onClick={buyMEP}>{isLoading ? <Spinner animation="border" size="sm" variant="light" /> : selectedLangObject.aceptar}</Button>
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
