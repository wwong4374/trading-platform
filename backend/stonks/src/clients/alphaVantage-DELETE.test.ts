// TODO: delete this file

import { describe, it } from 'vitest';
import { getTimeSeriesForTicker } from './alphaVantage';

describe('alphaVantage', () => {
  it('should get time series', async () => {
    const tradingSnapshots = await getTimeSeriesForTicker('AAPL');
    console.log('got trading snapshots: ', tradingSnapshots);
  });
});
