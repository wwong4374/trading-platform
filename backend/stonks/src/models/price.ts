import { BaseItem, Table } from './base';
import { db } from '../../db/connection';

import * as AlphaVantage from '../clients/alphaVantage';

const TABLE_NAME = Table.Price;

export interface BasePrice {
  securityId: string;
  tradingDate: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Price extends BaseItem, BasePrice {}

export async function insert(values: BasePrice): Promise<Price> {
  const [price] = await db(TABLE_NAME)
    .insert({
      ...values,
    })
    .returning('*');
  return price;
}

async function insertBulk(values: BasePrice[]): Promise<Price[]> {
  const prices = await db(TABLE_NAME).insert(values).returning('*');
  return prices;
}

export async function getLatestPriceForTicker(
  ticker: string
): Promise<BasePrice[]> {
  const basePrices = await AlphaVantage.getPriceForTicker(ticker);
  return await insertBulk(basePrices);
}
