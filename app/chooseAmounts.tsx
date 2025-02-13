import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import ButtonGroup  from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import { changeBalanceARS, changeBalanceUSD, selectBalanceARS, selectBalanceUSD, selectTxsHistory, resetTxsHistory, selectLang, changeLang } from "@/lib/userDataSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import { formatARS, formatUSD } from '@/features/amountsFormatFx';
import { ES } from '@/lang/ES';
import { EN } from '@/lang/EN';
import { useRouter } from 'next/navigation';

export default function ChooseAmounts() {

    const dispatch = useAppDispatch();
    const balanceARS = useAppSelector(selectBalanceARS);
    const balanceUSD = useAppSelector(selectBalanceUSD);
    const txsHistory = useAppSelector(selectTxsHistory);
    const userDataLang = useAppSelector(selectLang);

    const router = useRouter()

    const [ARSAmount, setARSAmount] = useState<number | null>(null);
    const [USDAmount, setUSDAmount] = useState<number | null>(null);
    const [resetButtonWasPressed, setResetButtonWasPressed] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<string>(userDataLang);

    // Language object
    const selectedLangObject: { [k: string]: string } = lang === 'ES'? ES : EN;

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

    const submitInputValues = () => {
        setError(null);
        // Validation
        if (!ARSAmount) return setError(selectedLangObject.ARSvalido)
        if (!USDAmount) return setError(selectedLangObject.USDvalido)
        if (ARSAmount <= 0 || USDAmount <= 0) return setError(selectedLangObject.monto_positivo)
        if (ARSAmount > 100000000 || USDAmount > 100000000) return setError(selectedLangObject.monto_menor)
        // Set and 'redirect'
        dispatch(changeBalanceARS(ARSAmount));
        dispatch(changeBalanceUSD(USDAmount));
        router.push('/mainCard')
    };

    const submitDefault = () => {
        // 'redirect'
        router.push('/mainCard')
    }

    const langHandler = (e: { currentTarget: { value: string } }) => {
        setLang(e.currentTarget.value)
        dispatch(changeLang(e.currentTarget.value))
    }

    return (
        <>
        <style type="text/css">
        {`
            .btn-custom1 {
              background-color: #000039;
              color: white;
            }
            .btn-custom1:hover {
              background-color: #000029;
              color: white;
            }
            .btn-custom2 {
              background-color: rgb(51, 151, 244);
              color: white;
            }
            .btn-custom2:hover {
              background-color: rgb(51, 121, 800);
              color: white;
            }
        `}
        </style>
        
        <Fade in appear>
            <Card className='text-center'>
                <Card.Body>

                    <ButtonGroup className='mb-4'>
                        <ToggleButton
                            id='radio-ESP'
                            type="radio"
                            variant={'light'}
                            value={'ES'}
                            checked={lang === 'ES'}
                            onChange={e => langHandler(e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#f1c142" d="M1 10H31V22H1z"></path><path d="M5,4H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" fill="#a0251e"></path><path d="M5,21H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24.5)" fill="#a0251e"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><path d="M12.614,13.091c.066-.031,.055-.14-.016-.157,.057-.047,.02-.15-.055-.148,.04-.057-.012-.144-.082-.13,.021-.062-.042-.127-.104-.105,.01-.068-.071-.119-.127-.081,.004-.068-.081-.112-.134-.069-.01-.071-.11-.095-.15-.035-.014-.068-.111-.087-.149-.028-.027-.055-.114-.057-.144-.004-.03-.047-.107-.045-.136,.002-.018-.028-.057-.044-.09-.034,.009-.065-.066-.115-.122-.082,.002-.07-.087-.111-.138-.064-.013-.064-.103-.087-.144-.036-.02-.063-.114-.075-.148-.017-.036-.056-.129-.042-.147,.022-.041-.055-.135-.031-.146,.036-.011-.008-.023-.014-.037-.016,.006-.008,.01-.016,.015-.025h.002c.058-.107,.004-.256-.106-.298v-.098h.099v-.154h-.099v-.101h-.151v.101h-.099v.154h.099v.096c-.113,.04-.169,.191-.11,.299h.002c.004,.008,.009,.017,.014,.024-.015,.002-.029,.008-.04,.017-.011-.067-.106-.091-.146-.036-.018-.064-.111-.078-.147-.022-.034-.057-.128-.046-.148,.017-.041-.052-.131-.028-.144,.036-.051-.047-.139-.006-.138,.064-.056-.033-.131,.017-.122,.082-.034-.01-.072,.006-.091,.034-.029-.047-.106-.049-.136-.002-.03-.054-.117-.051-.143,.004-.037-.059-.135-.04-.149,.028-.039-.06-.14-.037-.15,.035-.053-.043-.138,0-.134,.069-.056-.038-.137,.013-.127,.081-.062-.021-.125,.044-.104,.105-.05-.009-.096,.033-.096,.084h0c0,.017,.005,.033,.014,.047-.075-.002-.111,.101-.055,.148-.071,.017-.082,.125-.016,.157-.061,.035-.047,.138,.022,.154-.013,.015-.021,.034-.021,.055h0c0,.042,.03,.077,.069,.084-.023,.048,.009,.11,.06,.118-.013,.03-.012,.073-.012,.106,.09-.019,.2,.006,.239,.11-.015,.068,.065,.156,.138,.146,.06,.085,.133,.165,.251,.197-.021,.093,.064,.093,.123,.118-.013,.016-.043,.063-.055,.081,.024,.013,.087,.041,.113,.051,.005,.019,.004,.028,.004,.031,.091,.501,2.534,.502,2.616-.001v-.002s.004,.003,.004,.004c0-.003-.001-.011,.004-.031l.118-.042-.062-.09c.056-.028,.145-.025,.123-.119,.119-.032,.193-.112,.253-.198,.073,.01,.153-.078,.138-.146,.039-.104,.15-.129,.239-.11,0-.035,.002-.078-.013-.109,.044-.014,.07-.071,.049-.115,.062-.009,.091-.093,.048-.139,.069-.016,.083-.12,.022-.154Zm-.296-.114c0,.049-.012,.098-.034,.141-.198-.137-.477-.238-.694-.214-.002-.009-.006-.017-.011-.024,0,0,0-.001,0-.002,.064-.021,.074-.12,.015-.153,0,0,0,0,0,0,.048-.032,.045-.113-.005-.141,.328-.039,.728,.09,.728,.393Zm-.956-.275c0,.063-.02,.124-.054,.175-.274-.059-.412-.169-.717-.185-.007-.082-.005-.171-.011-.254,.246-.19,.81-.062,.783,.264Zm-1.191-.164c-.002,.05-.003,.102-.007,.151-.302,.013-.449,.122-.719,.185-.26-.406,.415-.676,.73-.436-.002,.033-.005,.067-.004,.101Zm-1.046,.117c0,.028,.014,.053,.034,.069,0,0,0,0,0,0-.058,.033-.049,.132,.015,.152,0,0,0,.001,0,.002-.005,.007-.008,.015-.011,.024-.219-.024-.495,.067-.698,.206-.155-.377,.323-.576,.698-.525-.023,.015-.039,.041-.039,.072Zm3.065-.115s0,0,0,0c0,0,0,0,0,0,0,0,0,0,0,0Zm-3.113,1.798v.002s-.002,0-.003,.002c0-.001,.002-.003,.003-.003Z" fill="#9b8028"></path><path d="M14.133,16.856c.275-.65,.201-.508-.319-.787v-.873c.149-.099-.094-.121,.05-.235h.072v-.339h-.99v.339h.075c.136,.102-.091,.146,.05,.235v.76c-.524-.007-.771,.066-.679,.576h.039s0,0,0,0l.016,.036c.14-.063,.372-.107,.624-.119v.224c-.384,.029-.42,.608,0,.8v1.291c-.053,.017-.069,.089-.024,.123,.007,.065-.058,.092-.113,.083,0,.026,0,.237,0,.269-.044,.024-.113,.03-.17,.028v.108s0,0,0,0v.107s0,0,0,0v.107s0,0,0,0v.108s0,0,0,0v.186c.459-.068,.895-.068,1.353,0v-.616c-.057,.002-.124-.004-.17-.028,0-.033,0-.241,0-.268-.054,.008-.118-.017-.113-.081,.048-.033,.034-.108-.021-.126v-.932c.038,.017,.073,.035,.105,.053-.105,.119-.092,.326,.031,.429l.057-.053c.222-.329,.396-.743-.193-.896v-.35c.177-.019,.289-.074,.319-.158Z" fill="#9b8028"></path><path d="M8.36,16.058c-.153-.062-.39-.098-.653-.102v-.76c.094-.041,.034-.115-.013-.159,.02-.038,.092-.057,.056-.115h.043v-.261h-.912v.261h.039c-.037,.059,.039,.078,.057,.115-.047,.042-.108,.118-.014,.159v.873c-.644,.133-.611,.748,0,.945v.35c-.59,.154-.415,.567-.193,.896l.057,.053c.123-.103,.136-.31,.031-.429,.032-.018,.067-.036,.105-.053v.932c-.055,.018-.069,.093-.021,.126,.005,.064-.059,.089-.113,.081,0,.026,0,.236,0,.268-.045,.024-.113,.031-.17,.028v.401h0v.215c.459-.068,.895-.068,1.352,0v-.186s0,0,0,0v-.108s0,0,0,0v-.107s0,0,0,0v-.107s0,0,0,0v-.108c-.056,.002-.124-.004-.169-.028,0-.033,0-.241,0-.269-.055,.008-.119-.018-.113-.083,.045-.034,.03-.107-.024-.124v-1.29c.421-.192,.383-.772,0-.8v-.224c.575,.035,.796,.314,.653-.392Z" fill="#9b8028"></path><path d="M12.531,14.533h-4.28l.003,2.572v1.485c0,.432,.226,.822,.591,1.019,.473,.252,1.024,.391,1.552,.391s1.064-.135,1.544-.391c.364-.197,.591-.587,.591-1.019v-4.057Z" fill="#a0251e"></path></svg>
                        </ToggleButton>
                        <ToggleButton
                            id='radio-ENG'
                            type="radio"
                            variant={'light'}
                            value={'EN'}
                            checked={lang === 'EN'}
                            onChange={e => langHandler(e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                        </ToggleButton>
                    </ButtonGroup>

                    <Card.Subtitle className='mb-3'>
                        {selectedLangObject.chooseAmounts}
                    </Card.Subtitle>

                    <Form onSubmit={e => { e.preventDefault(); submitInputValues(); }}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control placeholder={selectedLangObject.seleccioneARS} type="number" max={"100000000"} aria-label={selectedLangObject.seleccioneARS} onChange={ARSAmountHandler} />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>US$</InputGroup.Text>
                            <Form.Control placeholder={selectedLangObject.seleccioneUSD} type="number" max={"100000000"} aria-label={selectedLangObject.seleccioneUSD} onChange={USDAmountHandler} />
                        </InputGroup>
                    </Form>

                    {error && <div className='text-danger mb-3' style={{whiteSpace: 'pre-line'}}>{error}</div>}

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button className='w-100' variant="custom1" onClick={submitInputValues}>
                            {selectedLangObject.continuar}
                        </Button>
                    </div>

                    <div className='w-100 separator'/>

                    <Card.Subtitle className="mt-4 mb-3">{selectedLangObject.o_continue}</Card.Subtitle>
                    <div className='mt-3 mb-1 d-flex justify-content-center align-items-center'>
                        <h6><strong>{selectedLangObject.saldoARS}: </strong>{formatARS(balanceARS)}</h6>
                    </div>
                    <div className='mt-1 mb-3 d-flex justify-content-center align-items-center'>
                        <h6><strong>{selectedLangObject.saldoUSD}:</strong> {formatUSD(balanceUSD)}</h6>
                    </div>

                    <div className="d-flex gap-2 mb-2 justify-content-center">
                        <Button className='w-100' variant="custom2" onClick={submitDefault}>
                            {selectedLangObject.continuar}
                        </Button>
                    </div>

                    {txsHistory.length > 0 && (
                        <>
                            <div className='w-100 separator'/>
                            <div className="d-flex gap-2 mb-2 mt-4 justify-content-center">
                                <Button variant="danger" onClick={resetHistory}>
                                    {selectedLangObject.borrar_historial}
                                </Button>
                            </div>
                        </>
                    )}

                    {resetButtonWasPressed && (
                        <>
                            <div className='w-100 separator' />
                            <Alert variant={'success'} className='mb-2 mt-4'>{selectedLangObject.historial_borrado}.</Alert>
                        </>
                    )}

                </Card.Body>
            </Card>
        </Fade>
        </>
    );
}