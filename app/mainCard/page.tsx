"use client";

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Spinner from 'react-bootstrap/Spinner';
import { useAppSelector } from "@/lib/hooks";
import { selectBalanceARS, selectBalanceUSD, selectLang, selectTxsHistory } from '@/lib/userDataSlice';
import { TxsHistoryTable } from './TxsHistoryTable';
import { ES } from '@/lang/ES';
import { EN } from '@/lang/EN';
import { formatARS, formatUSD } from '@/features/amountsFormatFx';
import styles from "../page.module.css";
import { useRouter } from 'next/navigation';
import { AL30DataType, useAL30Data } from '@/features/getAL30Data';

const USDValue = (AL30Data: null | AL30DataType, buy: boolean) => {
  // Spinner while loading
  if (!AL30Data) return <Spinner className='mt-1' size='sm' animation="border" variant='light' role="status"></Spinner>
  // Operation and formatting
  const operation = buy? (AL30Data.ars_ask / 100) / (AL30Data.usd_bid / 100) : (AL30Data.ars_bid / 100) / (AL30Data.usd_ask / 100);
  const formattedPrice = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(operation);
  // Return element with a nice Fade In effect
  return <Fade in appear><small className='mainCard-small-text'>US${formattedPrice}</small></Fade>;
}

export default function MainCard() {

  // Selectors Redux hooks
  const balanceARS    = useAppSelector(selectBalanceARS)
  const balanceUSD    = useAppSelector(selectBalanceUSD)
  const txsHistory    = useAppSelector(selectTxsHistory)
  const userDataLang  = useAppSelector(selectLang);

  // Custom hook to fetch AL30 data
  const { AL30Data, error } = useAL30Data()

  // Error handling
  if ( error ) throw new Error('Error fetching AL30 data');

  // Router Hook for client side navigation
  const router = useRouter()

  // Language object
  const selectedLangObject: { [k: string]: string } = userDataLang === 'ES'? ES : EN;

  return (
  <div className={styles.page}>
    <main className={styles.main}>
      <Fade in appear>
          <Card className='text-center'>
              <Card.Body>
                  <Card.Title className='mb-3'>
                      <h3>{selectedLangObject.bienvenido}</h3>
                  </Card.Title>
                  
                  <div className='mt-4 mb-1 d-flex justify-content-center align-items-center'>
                      <h6>{selectedLangObject.saldoARS}: &nbsp;</h6>
                      <h5><strong>{formatARS(balanceARS)}</strong></h5>
                  </div>
                  <div className='mt-1 mb-4 d-flex justify-content-center align-items-center'>
                      <h6>{selectedLangObject.saldoUSD}: &nbsp;</h6>
                      <h5><strong>{formatUSD(balanceUSD)}</strong></h5>
                  </div>

                  <Card.Subtitle className="mb-3 text-muted">{selectedLangObject.que_desea}</Card.Subtitle>
                  <div className="d-flex gap-2 mb-2 mt-2 justify-content-center">
                      <Button className='mainCard-btns' variant="success" disabled={balanceARS === 0} onClick={() => { router.push('/mainCard/buy') }}>
                          {selectedLangObject.comprarUSD}
                          {USDValue(AL30Data, true)}
                      </Button>
                      <Button className='mainCard-btns' variant="danger" disabled={balanceUSD === 0} onClick={() => { router.push('/mainCard/sell') }}>
                          {selectedLangObject.venderUSD}
                          {USDValue(AL30Data, false)}
                      </Button>
                  </div>

                  <Button variant="light" className='mt-3' onClick={() => { router.push('/') }}>
                      {selectedLangObject.volver}
                  </Button>
              </Card.Body>
          </Card>
      </Fade>
      <TxsHistoryTable txs={txsHistory} selectedLangObject={selectedLangObject} />
    </main>
  </div>
  );
}