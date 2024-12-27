import { BaseItem, Table } from './base';
import { db } from '../../db/connection';

export enum SecurityType {
  STOCK = 'stock',
  BOND = 'bond',
  ETF = 'etf',
  CRYPTO = "crypto",
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
  const security = await db(TABLE_NAME).where({ ticker }).first();
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
  const [security] = await db(TABLE_NAME)
    .where({ id })
    .update({ ...values, updated: new Date() })
    .returning('*');
  return security;
}

export async function updateByTicker(ticker: string, values: UpsertValues): Promise<Security> {
  const [security] = await db(TABLE_NAME)
    .where({ ticker })
    .update({ ...values, updated: new Date() })
    .returning('*');
  return security;
}
