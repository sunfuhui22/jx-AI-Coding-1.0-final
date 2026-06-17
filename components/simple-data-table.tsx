import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
}

interface SimpleDataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => string | number;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyText?: string;
}

export function SimpleDataTable<T>({
  columns,
  rows,
  getRowKey,
  rowClassName,
  onRowClick,
  emptyText = "暂无数据",
}: SimpleDataTableProps<T>) {
  return (
    <div className="od-panel">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-[13px] text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-40">📋</span>
                    <span>{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const key = getRowKey?.(row, i) ?? `_row_${i}`;
                const extraClass = rowClassName?.(row) ?? "";
                return (
                  <tr
                    key={key}
                    className={`border-t border-[var(--border-soft)] transition-colors ${
                      onRowClick
                        ? "cursor-pointer hover:bg-[var(--accent-subtle)]/50"
                        : ""
                    } ${extraClass}`}
                    onClick={() => onRowClick?.(row)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onRowClick?.(row);
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="whitespace-nowrap px-4 py-2.5"
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
