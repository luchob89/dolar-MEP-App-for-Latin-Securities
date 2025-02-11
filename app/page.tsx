"use client"

import { Provider } from 'react-redux'
import { store } from './store'
import styles from "./page.module.css";
import ChooseAmounts from "./mainCard/chooseAmounts";

// AL30Data interface declaration
// export interface AL30Data {
//   ticker: string,
//   ars_bid: number,
//   ars_ask: number,
//   usd_bid: number,
//   usd_ask: number
// }

export default function Landing() {

  // VAMOS A DEJAR EL CÓDIGO DE FETCH COMETADO PARA HACER EL LLAMADO A LA API EN EL ROUTE HANDLER DE
  // LO QUE SIEMPRE DEBIÓ HABER SIDO LA 2DA PÁGINA: MAIN CARD

  // Fetch data from API. This is the only API request the app does. 
  // The endpoint used was mandatory as per the company's request.
  // const data    = await fetch('https://data912.com/live/mep')
  // const mepData = await data.json()

  // // Error handling
  // if ( !data.ok ) throw new Error('No data found');

  // // We will be only using the AL30 bond data.
  // const AL30    = mepData.filter( (bonus: { ticker: string; }) => bonus.ticker === 'AL30' )
  // const AL30Data: AL30Data = {
  //   ticker: AL30[0].ticker,
  //   ars_bid: AL30[0].ars_bid,
  //   ars_ask: AL30[0].ars_ask,
  //   usd_bid: AL30[0].usd_bid,
  //   usd_ask: AL30[0].usd_ask
  // }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Provider store={store}>
          <ChooseAmounts />
        </Provider>
      </main>
    </div>
  );
}
