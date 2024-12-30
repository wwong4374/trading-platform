const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/';

enum AlphaVantageEndpoint {
  TIME_SERIES_DAILY = 'TIME_SERIES_DAILY',
}

interface DailyTradingSnapshot {
  ticker: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getTimeSeriesForTicker(
  ticker: string
): Promise<DailyTradingSnapshot[]> {
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

  const dates = Object.keys(data['Time Series (Daily)']);
  const tradingSnapshots = dates.map((date) => {
    return {
      ticker,
      date: new Date(date),
      open:
        Math.round(
          parseFloat(data['Time Series (Daily)'][date]['1. open']) * 100
        ) / 100,
      high:
        Math.round(
          parseFloat(data['Time Series (Daily)'][date]['2. high']) * 100
        ) / 100,
      low:
        Math.round(
          parseFloat(data['Time Series (Daily)'][date]['3. low']) * 100
        ) / 100,
      close:
        Math.round(
          parseFloat(data['Time Series (Daily)'][date]['4. close']) * 100
        ) / 100,
      volume: parseInt(data['Time Series (Daily)'][date]['5. volume'], 10),
    };
  });

  return tradingSnapshots;
}
