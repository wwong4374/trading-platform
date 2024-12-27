import { BaseItem, Table } from './base';
import { db } from '../../db/connection';

export enum SecurityType {
  STOCK = 'stock',
  BOND = 'bond',
  ETF = 'etf',
  CRYPTO = 'crypto',
}

interface BaseSecurity {
  ticker: string;
  name: string;
  type: SecurityType;
}

interface Security extends BaseItem, BaseSecurity {}

type UpsertValues = Partial<BaseSecurity>;

const TABLE_NAME = Table.Securities;

export async function findMaybeOneById(id: string): Promise<Security | null> {
  const security = await db(TABLE_NAME).where({ id }).first();
  return security || null;
}

export async function findMaybeOneByTicker(ticker: string): Promise<Security | null> {
  const security = await db(TABLE_NAME).where({ ticker: ticker.toUpperCase() }).first();
  return security || null;
}

export async function insert(values: BaseSecurity): Promise<Security> {
  const [security] = await db(TABLE_NAME)
    .insert({
      ...values,
      ticker: values.ticker.toUpperCase(),
      created: new Date(),
      updated: new Date(),
    })
    .returning('*');
  return security;
}

export async function updateById(id: string, values: UpsertValues): Promise<Security> {
  const updateValues = { ...values, updated: new Date() };
  if (values.ticker) {
    updateValues.ticker = values.ticker.toUpperCase();
  }
  const [security] = await db(TABLE_NAME).where({ id }).update(updateValues).returning('*');
  return security;
}

export async function updateByTicker(ticker: string, values: UpsertValues): Promise<Security> {
  const [security] = await db(TABLE_NAME)
    .where({ ticker: ticker.toUpperCase() })
    .update({ ...values, updated: new Date() })
    .returning('*');
  return security;
}
