import React from "react";
import { ChevronDown } from "lucide-react";

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  children,
  error = "",
  helperText = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-stone-700"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full py-2.5 pl-3.5 pr-10 text-xs sm:text-sm rounded-xl border bg-white text-stone-900 transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-stone-50 disabled:cursor-not-allowed ${
            error
              ? "border-rose-400 focus:border-rose-600"
              : "border-stone-300 hover:border-stone-400"
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-600 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Select;
