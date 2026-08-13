import { forwardRef, type HTMLAttributes, type TableHTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

export type TableProps = TableHTMLAttributes<HTMLTableElement> & { label: string };

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, label, ...props },
  ref,
) {
  return (
    <div className="vr-table-scroll" tabIndex={0}>
      <table {...props} aria-label={label} className={cn("vr-table", className)} ref={ref} />
    </div>
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({ className, ...props }, ref) {
  return <thead {...props} className={cn("vr-table__header", className)} ref={ref} />;
});

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...props }, ref) {
  return <tbody {...props} className={cn("vr-table__body", className)} ref={ref} />;
});

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow({ className, ...props }, ref) {
  return <tr {...props} className={cn("vr-table__row", className)} ref={ref} />;
});

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(function TableHead({ className, ...props }, ref) {
  return <th {...props} className={cn("vr-table__head", className)} ref={ref} />;
});

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(function TableCell({ className, ...props }, ref) {
  return <td {...props} className={cn("vr-table__cell", className)} ref={ref} />;
});
