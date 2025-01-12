import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import { useAppDispatch } from "@/app/hooks";
import { changeMode } from '@/features/userDataSlice';
import { useState } from 'react';

const SellResult = ({ nominals, bonus, status }: { nominals: number, bonus: Bonus | null, status: 'pending' | 'ready' }) => {
    
    if ( status === 'ready' && nominals !== 0 && bonus ) {

        // Operación para determinar qué monto en USD puede deducir el usuario con la cant. de títulos que declaró. Declaración y formateo
        let amount = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(Math.floor(nominals * bonus.close))

        let formattedNominals = new Intl.NumberFormat("de-DE").format(nominals)

        return (
            <Fade in appear>
                <Card className='text-center mb-3'>
                    <Card.Body>
                        <div><strong>Bono:</strong> {bonus.ticker}</div>
                        <div><strong>Precio:</strong> ${bonus.close}</div>
                        <div><strong>Cant. de nominales:</strong> {formattedNominals}</div>
                        <Alert className='mt-2' variant={'success'}><strong>Monto a deducir:</strong> {amount}</Alert>
                        <small className="text-muted"><strong>Tip: </strong>Puede seguir editando los campos para encontrar nuevos resultados.</small>
                    </Card.Body>
                </Card>
            </Fade>
        )
    }
    return null;
}

interface Bonus {
    ticker: string, 
    close: number
}

export default function SellCard({ mepData }: { mepData: Array<{ticker: string, close: number}> }) {

    const dispatch  = useAppDispatch()

    const [nominals, setNominals] = useState(0);
    const [bonus, setBonus]         = useState<Bonus | null>(null);
    const [status, setStatus]       = useState<'pending' | 'ready'>('pending');
    const [error, setError]         = useState<string | null>(null);

    const nominalsHandler = (e:{ target: {value: string}}) => {
        setError(null)
        return setNominals(Number(e.target.value))
    }

    const bonusHandler = (e:{ target: {value: string}}) => {
        setError(null)

        let selectedBonusName = e.target.value
        let selectedBonus = mepData.filter( bonus => bonus.ticker === selectedBonusName )

        if ( selectedBonus.length > 0 ) return setBonus({
            ticker: selectedBonusName,
            close: selectedBonus[0].close
        })
        setBonus(null)
    }

    const submitHandler = () => {
        setError(null)

        // Validation
        if ( nominals === 0 ) return setError('Por favor, seleccione una cantidad válida.')
        if ( nominals < 0 ) return setError('Por favor, seleccione una cantidad mayor a 0.')
        if ( !bonus ) return setError('Por favor, seleccione un bono del listado.')

        setStatus('ready')
    }

    return(
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title className='mb3'><h3>Venta de bonos</h3></Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">Calculadora de venta de títulos</Card.Subtitle>

                    <Form onSubmit={ e => e.preventDefault() }>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label><strong>Cant. de nominales</strong></Form.Label>
                            <Form.Control type="number" placeholder="Seleccione cantidad" onChange={nominalsHandler}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBonus">
                            <Form.Label><strong>Bono</strong></Form.Label>
                            <Form.Select aria-label="Selección de bono" onChange={ e => bonusHandler(e) }>
                                <option className="text-muted">Seleccione un bono</option>
                                { mepData.map( bonus => <option key={bonus.ticker} value={bonus.ticker}>{bonus.ticker} (${bonus.close})</option> )}
                            </Form.Select>
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

                    <SellResult nominals={nominals} bonus={bonus} status={status} />

                </Card.Body>
            </Card>
        </Fade>
    )
}