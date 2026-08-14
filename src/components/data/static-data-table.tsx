import { EmptyState } from "../feedback";
import type { StaticDataTableProps } from "./data-table.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

/** A server-safe data table without selection, sorting, or event handlers. */
export function StaticDataTable<Row>({
  columns,
  emptyDescription = "Ajusta los filtros o agrega el primer elemento.",
  emptyTitle = "No hay resultados",
  getRowKey,
  label,
  rows,
}: StaticDataTableProps<Row>) {
  return (
    <Table label={label}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead data-align={column.align} key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? rows.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((column) => (
              <TableCell data-align={column.align} key={column.key}>{column.cell(row)}</TableCell>
            ))}
          </TableRow>
        )) : (
          <TableRow>
            <TableCell className="vr-data-table__empty" colSpan={columns.length}>
              <EmptyState description={emptyDescription} title={emptyTitle} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
