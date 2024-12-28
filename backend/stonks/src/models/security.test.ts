import * as uuid from 'uuid';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { db } from '../../db/connection';
import { Table } from './base';
import * as Security from './security';
import { SecurityType, updateById } from './security';

const TABLE_NAME = Table.Securities;

describe('models.security', () => {
  beforeEach(async () => {
    await db(TABLE_NAME).del();
  });

  afterEach(async () => {
    await db(TABLE_NAME).del();
  });

  const testSecurity = {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: SecurityType.STOCK,
  };

  describe('.insert', () => {
    it('should insert a new security', async () => {
      const security = await Security.insert(testSecurity);

      expect(security).toMatchObject({
        ...testSecurity,
        id: expect.any(String),
        created: expect.any(Date),
        updated: expect.any(Date),
      });
    });

    it('should throw on duplicate ticker', async () => {
      await Security.insert(testSecurity);
      await expect(Security.insert(testSecurity)).rejects.toThrow();
    });
  });

  describe('.findMaybeOneById', () => {
    it('should find security by id', async () => {
      const inserted = await Security.insert(testSecurity);
      const found = await Security.findMaybeOneById(inserted.id);

      expect(found).toMatchObject(testSecurity);
    });

    it('should return null for non-existent id', async () => {
      const found = await Security.findMaybeOneById(uuid.v7());
      expect(found).toBeNull();
    });
  });

  describe('.findMaybeOneByTicker', () => {
    it('should find security by ticker', async () => {
      await Security.insert(testSecurity);
      const found = await Security.findMaybeOneByTicker(testSecurity.ticker);

      expect(found).toMatchObject(testSecurity);
    });

    it('should return null for non-existent ticker', async () => {
      const found = await Security.findMaybeOneByTicker('FAKE');
      expect(found).toBeNull();
    });
  });

  describe('.updateById', () => {
    it('should update security by id', async () => {
      const inserted = await Security.insert(testSecurity);
      const updates = { name: 'Updated Name' };

      const updated = await updateById(inserted.id, updates);

      expect(updated).toMatchObject({
        ...testSecurity,
        ...updates,
      });
    });
  });

  describe('.updateByTicker', () => {
    it('should update security by ticker', async () => {
      await Security.insert(testSecurity);
      const updates = { name: 'Updated Name' };

      const updated = await Security.updateByTicker(testSecurity.ticker, updates);

      expect(updated).toMatchObject({
        ...testSecurity,
        ...updates,
      });
    });
  });
});
