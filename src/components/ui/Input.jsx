import React from "react";

export function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon = null,
  error = "",
  helperText = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-stone-700"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-stone-900 transition-all placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
            Icon ? "pl-10 pr-3.5" : "px-3.5"
          } ${
            error
              ? "border-rose-400 focus:border-rose-600 focus:ring-rose-500/20"
              : "border-stone-300 hover:border-stone-400"
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
