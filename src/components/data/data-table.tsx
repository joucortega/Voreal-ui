"use client";

import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "../../icons";
import { EmptyState } from "../feedback";
import { Skeleton } from "../feedback/skeleton";
import type { DataTableColumn, DataTableSort, SortDirection } from "./data-table.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type { DataTableColumn, DataTableSort, SortDirection } from "./data-table.types";

export type DataTableProps<Row> = {
  columns: readonly DataTableColumn<Row>[];
  emptyDescription?: ReactNode;
  emptyTitle?: ReactNode;
  getRowKey: (row: Row) => string;
  getRowLabel?: (row: Row) => string;
  label: string;
  loading?: boolean;
  onSelectionChange?: (keys: Set<string>) => void;
  onSortChange?: (sort: DataTableSort) => void;
  rows: readonly Row[];
  selectedKeys?: ReadonlySet<string>;
  sort?: DataTableSort;
};

export function DataTable<Row>({
  columns,
  emptyDescription = "Ajusta los filtros o agrega el primer elemento.",
  emptyTitle = "No hay resultados",
  getRowKey,
  getRowLabel,
  label,
  loading = false,
  onSelectionChange,
  onSortChange,
  rows,
  selectedKeys = new Set<string>(),
  sort,
}: DataTableProps<Row>) {
  const selectable = Boolean(onSelectionChange);
  const columnCount = columns.length + (selectable ? 1 : 0);

  function changeSelection(key: string, checked: boolean) {
    const next = new Set(selectedKeys);
    if (checked) next.add(key);
    else next.delete(key);
    onSelectionChange?.(next);
  }

  function changeAll(checked: boolean) {
    onSelectionChange?.(checked ? new Set(rows.map(getRowKey)) : new Set());
  }

  function changeSort(column: DataTableColumn<Row>) {
    const direction: SortDirection = sort?.key === column.key && sort.direction === "asc" ? "desc" : "asc";
    onSortChange?.({ direction, key: column.key });
  }

  const allSelected = rows.length > 0 && rows.every((row) => selectedKeys.has(getRowKey(row)));

  return (
    <Table label={label}>
      <TableHeader>
        <TableRow>
          {selectable ? (
            <TableHead className="vr-data-table__selection">
              <input
                aria-label="Seleccionar todos"
                checked={allSelected}
                className="vr-data-table__checkbox"
                onChange={(event) => changeAll(event.target.checked)}
                type="checkbox"
              />
            </TableHead>
          ) : null}
          {columns.map((column) => {
            const activeSort = sort?.key === column.key ? sort.direction : undefined;
            const headerName = typeof column.header === "string" ? column.header : column.key;
            return (
              <TableHead
                aria-sort={activeSort ? (activeSort === "asc" ? "ascending" : "descending") : undefined}
                data-align={column.align}
                key={column.key}
              >
                {column.sortable ? (
                  <button
                    aria-label={`Ordenar por ${headerName}`}
                    className="vr-data-table__sort"
                    onClick={() => changeSort(column)}
                    type="button"
                  >
                    <span>{column.header}</span>
                    {activeSort === "asc" ? <ArrowUpIcon /> : activeSort === "desc" ? <ArrowDownIcon /> : <ArrowUpDownIcon />}
                  </button>
                ) : column.header}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 3 }, (_, rowIndex) => (
            <TableRow key={`loading-${rowIndex}`}>
              {Array.from({ length: columnCount }, (_, cellIndex) => (
                <TableCell key={cellIndex}><Skeleton aria-label={cellIndex === 0 ? `Cargando fila ${rowIndex + 1}` : undefined} height="1.25rem" width="100%" /></TableCell>
              ))}
            </TableRow>
          ))
        ) : rows.length > 0 ? (
          rows.map((row) => {
            const key = getRowKey(row);
            const rowLabel = getRowLabel?.(row) ?? key;
            return (
              <TableRow data-selected={selectedKeys.has(key) ? "true" : undefined} key={key}>
                {selectable ? (
                  <TableCell className="vr-data-table__selection">
                    <input
                      aria-label={`Seleccionar ${rowLabel}`}
                      checked={selectedKeys.has(key)}
                      className="vr-data-table__checkbox"
                      onChange={(event) => changeSelection(key, event.target.checked)}
                      type="checkbox"
                    />
                  </TableCell>
                ) : null}
                {columns.map((column) => (
                  <TableCell data-align={column.align} key={column.key}>{column.cell(row)}</TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell className="vr-data-table__empty" colSpan={columnCount}>
              <EmptyState description={emptyDescription} title={emptyTitle ?? "No hay resultados"} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
