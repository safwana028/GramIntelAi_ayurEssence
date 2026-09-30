import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Standardized Accessible Button Component
 */
export function Button({
  children,
  variant = "primary", // "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold"
  size = "md", // "sm" | "md" | "lg"
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconRight: IconRight = null,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 focus-visible:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5 font-bold"
  };

  const variantStyles = {
    primary:
      "bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow border border-emerald-900/20 active:bg-emerald-950",
    secondary:
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90 shadow-2xs",
    outline:
      "bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 shadow-2xs hover:border-stone-400",
    ghost:
      "bg-transparent hover:bg-stone-100 text-stone-700 hover:text-stone-900",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-700/30",
    gold:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold shadow-sm border border-amber-600/30"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0 text-current" />
      ) : null}

      <span>{children}</span>

      {!loading && IconRight && (
        <IconRight className="w-4 h-4 shrink-0 text-current" />
      )}
    </button>
  );
}

export default Button;
