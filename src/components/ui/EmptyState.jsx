import React from "react";
import { Button } from "./Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = ""
}) {
  return (
    <div
      className={`p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 max-w-md mx-auto space-y-4 my-6 shadow-2xs ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto shadow-inner">
          <Icon className="w-7 h-7" />
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-stone-800 font-serif-heading">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            icon={actionIcon}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
