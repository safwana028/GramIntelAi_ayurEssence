import React from "react";

export function Badge({
  children,
  variant = "neutral", // "neutral" | "vata" | "pitta" | "kapha" | "tridosha" | "success" | "warning" | "danger" | "info"
  size = "md", // "sm" | "md"
  dot = false,
  className = ""
}) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]"
  };

  const variantStyles = {
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
    vata: "bg-sky-50 text-sky-800 border-sky-200/80",
    pitta: "bg-amber-50 text-amber-800 border-amber-200/80",
    kapha: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    tridosha: "bg-purple-50 text-purple-800 border-purple-200/80",
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    warning: "bg-amber-100 text-amber-900 border-amber-300",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-blue-50 text-blue-800 border-blue-200"
  };

  const dotColors = {
    neutral: "bg-stone-400",
    vata: "bg-sky-500",
    pitta: "bg-amber-500",
    kapha: "bg-emerald-600",
    tridosha: "bg-purple-500",
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-blue-500"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs tracking-wide ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[variant] || dotColors.neutral
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
