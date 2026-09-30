import React from "react";

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-stone-200/80 rounded-xl ${className}`}
    />
  );
}

export function SkeletonCard({ lines = 3, className = "" }) {
  return (
    <div
      className={`p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3.5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
      <div className="pt-2 flex justify-end gap-2">
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 4, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-stone-100 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-stone-100 p-4 space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 pt-3">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
