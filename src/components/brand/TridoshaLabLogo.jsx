import React from "react";

/**
 * TridoshaLab Brand Logo
 * 
 * Visual Motif:
 * - Tri-Dosha harmony: Vata (Atmospheric Prana - Sky Blue), Pitta (Tejas/Metabolism - Warm Amber),
 *   Kapha (Soma/Earth - Deep Clinical Emerald) harmonized in an equilateral tripartite geometry.
 * - Central Core: The "Ojas" vitality drop symbolizing equilibrium (Samadosha).
 * - Outer Ring: Clinical laboratory precision, institutional accreditation, and diagnostic integrity.
 */
export function TridoshaLabLogo({
  variant = "horizontal", // "icon" | "horizontal" | "stacked" | "badge"
  size = "md", // "xs" | "sm" | "md" | "lg" | "xl"
  light = false, // true when placed on dark backgrounds
  showSubtitle = true,
  className = ""
}) {
  const sizeMap = {
    xs: { icon: 22, text: "text-sm", sub: "text-[9px]" },
    sm: { icon: 28, text: "text-base", sub: "text-[10px]" },
    md: { icon: 38, text: "text-xl", sub: "text-xs" },
    lg: { icon: 48, text: "text-2xl", sub: "text-sm" },
    xl: { icon: 64, text: "text-3xl", sub: "text-base" }
  };

  const { icon: iconSize, text: textSize, sub: subSize } = sizeMap[size] || sizeMap.md;

  // The Pure SVG Vector Icon
  const IconSvg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label="TridoshaLab Emblem"
    >
      <defs>
        {/* Deep Clinical Emerald Gradient (Kapha / Ojas / Earth) */}
        <linearGradient id="tdl-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#1B4D3E" />
        </linearGradient>

        {/* Warm Ayurvedic Gold Gradient (Pitta / Tejas / Fire) */}
        <linearGradient id="tdl-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Atmospheric Sky Gradient (Vata / Prana / Air) */}
        <linearGradient id="tdl-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Central Core Glow Gradient */}
        <radialGradient id="tdl-glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>

        {/* Soft Drop Shadow Filter for clinical depth */}
        <filter id="tdl-shadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" floodColor="#0F172A" />
        </filter>
      </defs>

      {/* Outer Clinical Precision Geometry: Hexagonal Circle Ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={light ? "rgba(255, 255, 255, 0.08)" : "rgba(27, 77, 62, 0.05)"}
        stroke={light ? "rgba(245, 158, 11, 0.5)" : "rgba(27, 77, 62, 0.25)"}
        strokeWidth="1.75"
        strokeDasharray="6 3"
      />

      <circle
        cx="50"
        cy="50"
        r="42"
        fill={light ? "#16382D" : "#FFFFFF"}
        stroke={light ? "rgba(255,255,255,0.15)" : "#E2E8F0"}
        strokeWidth="1.5"
        filter="url(#tdl-shadow)"
      />

      {/* Tri-Dosha Petal Motif */}
      <g transform="translate(0, 0)">
        {/* Petal 1: Kapha (Bottom-Center / Foundation / Earth & Water) */}
        <path
          d="M50 78 C42 66 38 52 50 38 C62 52 58 66 50 78 Z"
          fill="url(#tdl-emerald)"
          opacity="0.92"
        />

        {/* Petal 2: Vata (Top-Left / Movement & Prana) */}
        <path
          d="M50 38 C36 34 26 44 24 58 C38 60 48 50 50 38 Z"
          fill="url(#tdl-sky)"
          opacity="0.88"
        />

        {/* Petal 3: Pitta (Top-Right / Transformation & Tejas) */}
        <path
          d="M50 38 C64 34 74 44 76 58 C62 60 52 50 50 38 Z"
          fill="url(#tdl-gold)"
          opacity="0.92"
        />

        {/* Central Prana / Ojas Drop (Vital Health Core) */}
        <circle cx="50" cy="50" r="14" fill="url(#tdl-glow)" />

        <circle
          cx="50"
          cy="49"
          r="6.5"
          fill="#FFFFFF"
          stroke="#D97706"
          strokeWidth="1.5"
        />

        {/* Radiant Inner Spark / Equilibrium Axis */}
        <circle cx="50" cy="49" r="2.5" fill="#1B4D3E" />

        {/* Top Ascending Lotus Tip (Sahasrara / Clarity) */}
        <path
          d="M50 20 L52 26 L50 29 L48 26 Z"
          fill="#F59E0B"
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {IconSvg}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xs ${
          light
            ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-100"
            : "bg-emerald-50 border-emerald-200/90 text-emerald-950"
        } ${className}`}
      >
        {IconSvg}
        <span className="font-serif-heading font-bold tracking-tight text-xs">
          Tridosha<span className="text-amber-500">Lab</span>
        </span>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
        {IconSvg}
        <div className="mt-2.5">
          <span
            className={`font-serif-heading font-extrabold tracking-tight ${textSize} block leading-tight ${
              light ? "text-white" : "text-stone-900"
            }`}
          >
            Tridosha<span className={light ? "text-amber-400" : "text-emerald-700"}>Lab</span>
          </span>
          {showSubtitle && (
            <span
              className={`block ${subSize} font-medium tracking-wider uppercase mt-0.5 ${
                light ? "text-emerald-200/80" : "text-stone-500"
              }`}
            >
              Ayurvedic Assessment Platform
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {IconSvg}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif-heading font-extrabold tracking-tight ${textSize} ${
              light ? "text-white" : "text-stone-900"
            }`}
          >
            Tridosha<span className={light ? "text-amber-400" : "text-emerald-700"}>Lab</span>
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subSize} font-medium tracking-normal ${
              light ? "text-emerald-200/80" : "text-stone-500"
            }`}
          >
            Clinical Prakriti Intelligence
          </span>
        )}
      </div>
    </div>
  );
}

export default TridoshaLabLogo;
