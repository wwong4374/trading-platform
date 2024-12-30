import { describe, expect, beforeEach, afterEach, test } from 'vitest';
import * as uuid from 'uuid';
import supertest from 'supertest';

import { db } from '../../db/connection';
import { Table } from '../models/base';
import * as Security from '../models/security';
import { SecurityType } from '../models/security';
import { app } from '../app';

const request = supertest(app);
const TABLE_NAME = Table.Security;

describe('controllers.security', () => {
  beforeEach(async () => {
    await db(TABLE_NAME).del();
  });

  afterEach(async () => {
    await db(TABLE_NAME).del();
  });

  const testSecurity: Security.BaseSecurity = {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: SecurityType.STOCK,
  };

  describe('GET /securities/:id', () => {
    test('should return security when found by id', async () => {
      const security = await Security.insert(testSecurity);
      const response = await request.get(`/securities/${security.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...testSecurity,
        id: security.id,
        created: expect.any(String),
        updated: expect.any(String),
      });
    });

    test('should return 404 when security is not found', async () => {
      const response = await request.get(`/securities/${uuid.v7()}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    test('should return 500 when invalid uuid is provided', async () => {
      const response = await request.get('/securities/not-a-uuid');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /securities/:ticker', () => {
    test('should return security when found by ticker', async () => {
      const security = await Security.insert(testSecurity);
      const response = await request.get(
        `/securities/ticker/${security.ticker}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...testSecurity,
        id: security.id,
        created: expect.any(String),
        updated: expect.any(String),
      });
    });

    test('should return 404 when security is not found', async () => {
      const response = await request.get('/securities/ticker/not-a-ticker');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });
  });

  describe('POST /securities', () => {
    test('should create a new security', async () => {
      const response = await request.post('/securities').send(testSecurity);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        ...testSecurity,
        id: expect.any(String),
      });
    });

    test('should return 500 when invalid security is provided', async () => {
      const response = await request.post('/securities').send({
        ...testSecurity,
        type: 'INVALID',
      });
      const response2 = await request.post('/securities').send({
        ...testSecurity,
        type: undefined,
      });

      expect(response.status).toBe(500);
      expect(response2.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(response2.body).toEqual({ error: 'Internal server error' });
    });
  });
});
