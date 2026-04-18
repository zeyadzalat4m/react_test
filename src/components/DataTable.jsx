import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip
} from '@mui/material';

function DataTable({ columns, rows, getRowClassName, renderActions }) {
  return (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} align={column.align || 'left'}>
                {column.headerName}
              </TableCell>
            ))}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No records available</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} sx={getRowClassName?.(row)}>
                {columns.map((column) => (
                  <TableCell key={`${row.id}-${column.field}`} align={column.align || 'left'}>
                    {column.valueGetter ? column.valueGetter(row) : row[column.field]}
                  </TableCell>
                ))}
                <TableCell align="center">{renderActions(row)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
