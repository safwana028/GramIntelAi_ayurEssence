import React from "react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "emerald", // "emerald" | "amber" | "sky" | "purple"
  onClick,
  className = ""
}) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-50/70",
      border: "border-emerald-200/80",
      iconBg: "bg-emerald-100 text-emerald-800",
      accent: "text-emerald-900"
    },
    amber: {
      bg: "bg-amber-50/70",
      border: "border-amber-200/80",
      iconBg: "bg-amber-100 text-amber-800",
      accent: "text-amber-900"
    },
    sky: {
      bg: "bg-sky-50/70",
      border: "border-sky-200/80",
      iconBg: "bg-sky-100 text-sky-800",
      accent: "text-sky-900"
    },
    purple: {
      bg: "bg-purple-50/70",
      border: "border-purple-200/80",
      iconBg: "bg-purple-100 text-purple-800",
      accent: "text-purple-900"
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border bg-white shadow-2xs transition-all ${
        onClick ? "cursor-pointer hover:shadow-md hover:border-emerald-600/40" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-heading">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.iconBg} shadow-2xs`}>
            <Icon className="w-5 h-5 shrink-0" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold">{trend}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
