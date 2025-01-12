import styles from "./page.module.css";
import App from "./appComponent";

export interface AL30Data {
  ticker: string,
  ars_bid: number,
  ars_ask: number,
  usd_bid: number,
  usd_ask: number
}

export default async function Home() {

  const data    = await fetch('https://data912.com/live/mep')
  const mepData = await data.json()
  const AL30    = mepData.filter( (bonus: { ticker: string; }) => bonus.ticker === 'AL30' )
  const AL30Data: AL30Data = {
    ticker: AL30[0].ticker,
    ars_bid: AL30[0].ars_bid,
    ars_ask: AL30[0].ars_ask,
    usd_bid: AL30[0].usd_bid,
    usd_ask: AL30[0].usd_ask
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <App AL30Data={AL30Data} />
      </main>
    </div>
  );
}
