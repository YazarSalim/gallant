// components/Table.tsx
"use client";

interface Column {
  key: string;
  label: string;
}

interface TableProps<T> {
  columns: Column[];
  data: T[];
  actions?: (row: T) => React.ReactNode; 
}

export default function Table<T>({ columns, data, actions }: TableProps<T>) {
  return (
    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-2 text-left text-gray-700 font-medium uppercase tracking-wider"
            >
              {col.label}
            </th>
          ))}
          {actions && (
            <th className="px-4 py-2 text-left text-gray-700 font-medium uppercase tracking-wider">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-2 text-center text-gray-500">
              No data found.
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {/* @ts-ignore */}
                  {row[col.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-2 ">{actions(row)}</td>}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
