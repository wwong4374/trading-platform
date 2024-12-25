import { BaseItem } from "../base/base";

enum Security {
  STOCK = "stock",
  BOND = "bond",
  ETF = "etf",
  CRYPTO = "crypto",
}

interface BaseSecurity extends BaseItem {
  ticker: string;
  name: string;
  type: Security;
}


