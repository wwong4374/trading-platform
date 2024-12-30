import { BaseItem, Table } from './base';
import { db } from '../../db/connection';

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
