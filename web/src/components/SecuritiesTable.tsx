import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

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

async function fetchSecurities() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/securities`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch securities');
  }
  return response.json();
}

export function SecuritiesTable() {
  const {
    data: securities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['securities'],
    queryFn: fetchSecurities,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading securities: {error.message}</div>;
  }

  const TABLE_HEADERS = ['Ticker', 'Name', 'Type', 'Latest Price'];
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_HEADERS.map((tableHeader) => (
              <TableCell key={tableHeader}>{tableHeader}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {securities.map((security: Security) => (
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
