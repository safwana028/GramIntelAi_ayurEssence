import React from "react";

export function Card({ children, className = "", hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-stone-200/90 shadow-2xs ${
        hover
          ? "hover:border-emerald-600/40 hover:shadow-md transition-all duration-200 cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`p-5 sm:p-6 border-b border-stone-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-base sm:text-lg font-bold text-stone-900 tracking-tight font-serif-heading ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-xs text-stone-500 mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`p-4 sm:p-5 bg-stone-50/60 rounded-b-2xl border-t border-stone-100 flex items-center justify-between ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
