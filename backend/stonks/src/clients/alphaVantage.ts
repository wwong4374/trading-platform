import * as Security from '../models/security';
import { BasePrice } from '../models/price';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/';

enum AlphaVantageEndpoint {
  TIME_SERIES_DAILY = 'TIME_SERIES_DAILY',
}

export async function getPricesForTicker(ticker: string): Promise<BasePrice[]> {
  const params = new URLSearchParams({
    function: AlphaVantageEndpoint.TIME_SERIES_DAILY,
    symbol: ticker,
    apikey: process.env.ALPHA_VANTAGE_API_KEY ?? '',
  });
  const url = `${ALPHA_VANTAGE_BASE_URL}/query?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  const receivedTicker = data['Meta Data']['2. Symbol'];
  if (receivedTicker !== ticker) {
    throw new Error(
      `Received ticker ${receivedTicker} does not match requested ticker ${ticker}`
    );
  }

  const security =
    (await Security.findMaybeOneByTicker(ticker)) ||
    (await Security.insert({ ticker, type: Security.SecurityType.Stock }));
  const dates = Object.keys(data['Time Series (Daily)']);
  const basePrices = dates.map((date) => {
    return {
      securityId: security.id,
      tradingDate: new Date(date),
      open: Math.round(
        parseFloat(data['Time Series (Daily)'][date]['1. open']) * 100
      ),
      high: Math.round(
        parseFloat(data['Time Series (Daily)'][date]['2. high']) * 100
      ),
      low: Math.round(
        parseFloat(data['Time Series (Daily)'][date]['3. low']) * 100
      ),
      close: Math.round(
        parseFloat(data['Time Series (Daily)'][date]['4. close']) * 100
      ),
      volume: parseInt(data['Time Series (Daily)'][date]['5. volume'], 10),
    };
  });

  return basePrices;
}
