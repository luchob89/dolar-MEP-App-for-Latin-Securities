"use client"

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import InputGroup from 'react-bootstrap/InputGroup';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectBalanceARS, selectBalanceUSD, selectLang } from '@/lib/userDataSlice';
import { useState } from 'react';
import { formatARS, formatUSD } from '@/features/amountsFormatFx';
import { SellCalculationResult } from './SellCalculationResult';
import { useAL30Data } from '@/features/getAL30Data';
import { useRouter } from 'next/navigation';
import styles from "@/app/page.module.css";
import { ES } from '@/lang/ES';
import { EN } from '@/lang/EN';

export default function SellCard() {

  const dispatch   = useAppDispatch()
  const balanceARS = useAppSelector(selectBalanceARS)
  const balanceUSD = useAppSelector(selectBalanceUSD)
  const userDataLang  = useAppSelector(selectLang);
  
  // Language object
  const selectedLangObject: { [k: string]: string } = userDataLang === 'ES'? ES : EN;

  // Custom hook to fetch AL30 data
  const { AL30Data } = useAL30Data()
  
  // Router Hook for client side navigation
  const router = useRouter()

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
      if (sellAmount === 0) return setError(selectedLangObject.monto_valido)
      if (sellAmount < 0) return setError(selectedLangObject.un_monto_positivo)
      if (sellAmount > 100000000) return setError(selectedLangObject.monto_menor)
      setStatus('ready')
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <style type="text/css">
        {`
            .btn-custom1 {
              background-color: #000039;
              color: white;

              &:hover {
                background-color: #000029;
                color: white;
                }
            }
            .btn-custom2 {
              background-color: rgb(51, 151, 244);
              color: white;

              &:hover {
                background-color: rgb(51, 121, 800);
                color: white;
                }
            }
        `}
        </style>
        <Fade in appear>
            <Card className='text-center'>
              <Card.Body>
                <Card.Title className='mb3'> <h4>{selectedLangObject.ventaMEP}</h4> </Card.Title>
                <Card.Subtitle className="mb-3 text-muted">{selectedLangObject.calculadora_venta}</Card.Subtitle>

                <div className='mt-3 d-flex justify-content-around align-items-center'>
                    <h6>{selectedLangObject.saldoARS}: <strong>{formatARS(balanceARS)}</strong></h6>
                </div>
                <div className='mb-1 d-flex justify-content-around align-items-center'>
                    <h6>{selectedLangObject.saldoUSD}: <strong>{formatUSD(balanceUSD)}</strong></h6>
                </div>

                <Form onSubmit={e => { e.preventDefault(); submitHandler() }}>
                    <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label><strong className='color-blue'>{selectedLangObject.monto_vender}</strong></Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>US$</InputGroup.Text>
                            <Form.Control placeholder={selectedLangObject.seleccioneUSD} type="number" max={"100000000"} aria-label={selectedLangObject.seleccioneUSD} onChange={sellAmountHandler} />
                        </InputGroup>
                        <Button className='w-100 mt-3 mb-2' variant='custom1' size='sm' onClick={allHandler}>{selectedLangObject.vender_disponible}</Button>
                    </Form.Group>
                </Form>

                {error && <div className='text-danger mb-3' style={{whiteSpace: 'pre-line'}}>{error}</div>}

                <div className="d-flex gap-2 mb-2 justify-content-center">
                    <Button variant="custom2" className='w-100' onClick={submitHandler}>
                        {selectedLangObject.calcular}
                    </Button>
                    <Button variant="light" className='w-100' onClick={() => { router.push('/mainCard') }}>
                        {selectedLangObject.volver}
                    </Button>
                </div>

                { AL30Data &&
                <SellCalculationResult 
                    amount={sellAmount} 
                    status={status} 
                    AL30Data={AL30Data} 
                    balanceARS={balanceARS} 
                    balanceUSD={balanceUSD} 
                    dispatch={dispatch} 
                    selectedLangObject={selectedLangObject}
                />
                }

              </Card.Body>
            </Card>
        </Fade>
      </main>
    </div>
  )
}