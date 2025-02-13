import useSWR from "swr";

// Fetcher definition to use with SWR
const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())

// AL30Data interface declaration
export interface AL30DataType {
  ticker: string,
  ars_bid: number,
  ars_ask: number,
  usd_bid: number,
  usd_ask: number
}

// Fetch data from API. This is the only API request the app does. 
// The endpoint used was mandatory as per the company's request.
export const useAL30Data = () => {

  // SWR request
  const { data, error, isLoading } = useSWR('https://data912.com/live/mep', fetcher)

  // Error and loading state handling
  if ( error || isLoading ) return { AL30Data: null, error, isLoading }

  // We will be only using the AL30 bond data.
  const AL30 = data.filter( (bonus: { ticker: string; }) => bonus.ticker === 'AL30' )
  const AL30Data: AL30DataType = {
    ticker: AL30[0].ticker,
    ars_bid: AL30[0].ars_bid,
    ars_ask: AL30[0].ars_ask,
    usd_bid: AL30[0].usd_bid,
    usd_ask: AL30[0].usd_ask
  }

  // Return the AL30 data
  return { AL30Data, error, isLoading }
}