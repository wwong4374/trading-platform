import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

enum SecurityType {
  Stock = 'Stock',
  Bond = 'Bond',
  Etf = 'ETF',
  Crypto = 'Crypto',
}
interface Security {
  id: string;
  ticker: string;
  type: SecurityType;
  latestPrice?: number | null;
  name?: string | null;
}

// TODO: actually retrieve securities from DB
const mockSecurities: Security[] = [
  {
    id: '1',
    ticker: 'AAPL',
    type: SecurityType.Stock,
    name: 'Apple Inc.',
    latestPrice: 17350,
  },
  {
    id: '2',
    ticker: 'GOOGL',
    type: SecurityType.Stock,
    name: 'Alphabet Inc.',
    latestPrice: 14180,
  },
  {
    id: '3',
    ticker: 'MSFT',
    type: SecurityType.Stock,
    name: 'Microsoft Corporation',
    latestPrice: 41165,
  },
];

export function SecuritiesTable() {
  const TABLE_HEADERS = ['Ticker', 'Name', 'Type', 'Latest Price'];
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_HEADERS.map((tableHeader) => (
              <TableCell>{tableHeader}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {mockSecurities.map((security) => (
            <TableRow key={security.id}>
              <TableCell>{security.ticker}</TableCell>
              <TableCell>{security.name ?? security.ticker}</TableCell>
              <TableCell>{security.type}</TableCell>
              <TableCell>
                {security.latestPrice
                  ? `$${(security.latestPrice / 100).toFixed(2)}`
                  : 'Unavailable'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
