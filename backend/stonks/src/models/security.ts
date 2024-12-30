import { BaseItem, Table } from './base';
import { db } from '../../db/connection';

const TABLE_NAME = Table.Security;

export enum SecurityType {
  Stock = 'STOCK',
  Bond = 'BOND',
  Etf = 'ETF',
  Crypto = 'CRYPTO',
}

export interface BaseSecurity {
  ticker: string;
  type: SecurityType;
  name?: string | null;
}

export interface Security extends BaseItem, BaseSecurity {}

export type UpdateValues = Partial<BaseSecurity>;

export async function findMaybeOneById(id: string): Promise<Security | null> {
  const security = await db(TABLE_NAME).where({ id }).first();
  return security || null;
}

export async function findMaybeOneByTicker(
  ticker: string
): Promise<Security | null> {
  const security = await db(TABLE_NAME)
    .where({ ticker: ticker.toUpperCase() })
    .first();
  return security || null;
}

export async function insert(values: BaseSecurity): Promise<Security> {
  const [security] = await db(TABLE_NAME)
    .insert({
      ...values,
      ticker: values.ticker.toUpperCase(),
    })
    .returning('*');
  return security;
}

export async function updateById(
  id: string,
  values: UpdateValues
): Promise<Security> {
  const updateValues = { ...values, updated: new Date() };
  if (values.ticker) {
    updateValues.ticker = values.ticker.toUpperCase();
  }
  const [security] = await db(TABLE_NAME)
    .where({ id })
    .update(updateValues)
    .returning('*');
  return security;
}

export async function updateByTicker(
  ticker: string,
  values: UpdateValues
): Promise<Security> {
  const [security] = await db(TABLE_NAME)
    .where({ ticker: ticker.toUpperCase() })
    .update({ ...values, updated: new Date() })
    .returning('*');
  return security;
}
