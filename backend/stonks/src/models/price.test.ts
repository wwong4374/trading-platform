import { describe, expect, beforeEach, afterEach, test } from 'vitest';
import * as uuid from 'uuid';

import { db } from '../../db/connection';
import { Table } from './base';
import * as Price from './price';
import * as Security from './security';
import { SecurityType } from './security';

const TABLE_NAME = Table.Price;

describe('models.price', () => {
  beforeEach(async () => {
    await db(TABLE_NAME).del();
    await db(Table.Security).del();
  });

  afterEach(async () => {
    await db(TABLE_NAME).del();
    await db(Table.Security).del();
  });

  const testSecurity: Security.BaseSecurity = {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: SecurityType.Stock,
  };

  describe('.insert', () => {
    test('should insert a new price', async () => {
      const security = await Security.insert(testSecurity);
      const basePrice: Price.BasePrice = {
        securityId: security.id,
        tradingDate: new Date(),
        open: 100,
        high: 110,
        low: 95,
        close: 105,
        volume: 1000000,
      };
      const price = await Price.insert(basePrice);

      expect(price).toMatchObject({
        ...basePrice,
        id: expect.any(String),
        created: expect.any(Date),
        updated: expect.any(Date),
      });
    });

    test('should throw on invalid security id', async () => {
      const basePrice = {
        securityId: uuid.v7(),
        tradingDate: new Date(),
        open: 100,
        high: 110,
        low: 95,
        close: 105,
        volume: 1000000,
      };

      await expect(Price.insert(basePrice)).rejects.toThrow();
    });
  });
});
