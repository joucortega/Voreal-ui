import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";
export type DataTableSort = { direction: SortDirection; key: string };

export type DataTableColumn<Row> = {
  align?: "center" | "end" | "start";
  cell: (row: Row) => ReactNode;
  header: ReactNode;
  key: string;
  sortable?: boolean;
};

export type StaticDataTableProps<Row> = {
  columns: readonly DataTableColumn<Row>[];
  emptyDescription?: ReactNode;
  emptyTitle?: ReactNode;
  getRowKey: (row: Row) => string;
  label: string;
  rows: readonly Row[];
};
