import * as Price from './price';
import { BaseItem, SortOrder, Table } from './base';
import { db } from '../../db/connection';

const TABLE_NAME = Table.Security;

export enum SecurityType {
  Stock = 'Stock',
  Bond = 'Bond',
  Etf = 'ETF',
  Crypto = 'Crypto',
}

export interface BaseSecurity {
  ticker: string;
  type: SecurityType;
  name?: string | null;
}

export interface Security extends BaseItem, BaseSecurity {}

export type UpdateValues = Partial<BaseSecurity>;

interface SecurityWithPrice
  extends Security,
    Omit<Price.BasePrice, 'securityId'> {}

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

export async function findOneWithPricesByTicker(
  ticker: string
): Promise<SecurityWithPrice[]> {
  const securityWithPrices = await db(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      `${Table.Price}.tradingDate`,
      `${Table.Price}.open`,
      `${Table.Price}.high`,
      `${Table.Price}.low`,
      `${Table.Price}.close`,
      `${Table.Price}.volume`,
    ])
    .where({ [`${TABLE_NAME}.ticker`]: ticker.toUpperCase() })
    .leftJoin(`${Table.Price}`, `${TABLE_NAME}.id`, `${Table.Price}.securityId`)
    .orderBy(`${Table.Price}.tradingDate`, SortOrder.Descending);

  return securityWithPrices;
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
