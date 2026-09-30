import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

/**
 * Standardized Accessible Alert Component
 */
export function Alert({
  variant = "info", // "info" | "success" | "warning" | "danger" | "neutral"
  title,
  children,
  icon: CustomIcon,
  onClose,
  action,
  className = ""
}) {
  const variantMap = {
    info: {
      container: "bg-sky-50/80 border-sky-200/90 text-sky-950",
      icon: Info,
      iconColor: "text-sky-600",
      titleColor: "text-sky-900"
    },
    success: {
      container: "bg-emerald-50/90 border-emerald-200/90 text-emerald-950",
      icon: CheckCircle2,
      iconColor: "text-emerald-700",
      titleColor: "text-emerald-900"
    },
    warning: {
      container: "bg-amber-50/90 border-amber-200/90 text-amber-950",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      titleColor: "text-amber-900"
    },
    danger: {
      container: "bg-rose-50/90 border-rose-200/90 text-rose-950",
      icon: AlertCircle,
      iconColor: "text-rose-600",
      titleColor: "text-rose-900"
    },
    neutral: {
      container: "bg-stone-50 border-stone-200 text-stone-800",
      icon: Info,
      iconColor: "text-stone-500",
      titleColor: "text-stone-900"
    }
  };

  const current = variantMap[variant] || variantMap.info;
  const IconComponent = CustomIcon || current.icon;
  const isAssertive = variant === "danger" || variant === "warning";

  return (
    <div
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
      className={`relative w-full rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs transition-all ${current.container} ${className}`}
    >
      {IconComponent && (
        <div className={`shrink-0 mt-0.5 ${current.iconColor}`}>
          <IconComponent className="w-5 h-5" aria-hidden="true" />
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1">
        {title && (
          <h4 className={`text-xs sm:text-sm font-bold tracking-tight ${current.titleColor}`}>
            {title}
          </h4>
        )}
        <div className="text-xs leading-relaxed opacity-90 font-sans">
          {children}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
