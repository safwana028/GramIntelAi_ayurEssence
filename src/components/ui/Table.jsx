import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-stone-200/90 bg-white shadow-2xs">
      <table className={`w-full text-left border-collapse text-xs ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <thead className={`bg-stone-50/90 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px] ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return (
    <tbody className={`divide-y divide-stone-100 text-stone-800 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", onClick, hover = true }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${
        hover ? "hover:bg-stone-50/70" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children, className = "" }) {
  return (
    <th className={`py-3.5 px-4 font-semibold text-stone-600 ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`py-3.5 px-4 text-xs ${className}`}>{children}</td>;
}

export default Table;
