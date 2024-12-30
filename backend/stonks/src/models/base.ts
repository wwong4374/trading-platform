export interface BaseItem {
  id: string;
  created: Date;
  updated: Date;
}

export enum Table {
  Price = 'prices',
  Security = 'securities',
}

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}
