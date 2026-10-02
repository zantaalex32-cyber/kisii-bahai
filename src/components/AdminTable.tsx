import React from 'react';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found',
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200 font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-slate-50/70 transition">
                {columns.map((col, idx) => (
                  <td key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.render
                      ? col.render(item)
                      : col.accessor
                      ? (item[col.accessor] as any)
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
