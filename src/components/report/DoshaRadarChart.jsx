import React from "react";

/**
 * High-precision SVG Radar & Polar Chart for Dosha Distribution
 * Supports single assessment mode or comparative overlay (e.g. Baseline vs Follow-up)
 */
export function DoshaRadarChart({
  scores,
  compareScores = null,
  size = 280,
  showLabels = true
}) {
  const center = size / 2;
  const radius = size * 0.38;

  // 3 Primary Dosha Axes (Vata, Pitta, Kapha) at 120-degree intervals
  // Vata at top (-90 deg), Pitta at bottom-right (30 deg), Kapha at bottom-left (150 deg)
  const angles = {
    vata: -Math.PI / 2,
    pitta: Math.PI / 6,
    kapha: (5 * Math.PI) / 6
  };

  const getPoint = (dosha, value) => {
    // scale 0 to 100%
    const normalized = Math.min(Math.max(value, 0), 100) / 100;
    const r = normalized * radius;
    const angle = angles[dosha];
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const currentPoints = {
    vata: getPoint("vata", scores.vata || 33),
    pitta: getPoint("pitta", scores.pitta || 33),
    kapha: getPoint("kapha", scores.kapha || 33)
  };

  const currentPath = `M ${currentPoints.vata.x} ${currentPoints.vata.y} L ${currentPoints.pitta.x} ${currentPoints.pitta.y} L ${currentPoints.kapha.x} ${currentPoints.kapha.y} Z`;

  let comparePath = null;
  if (compareScores) {
    const cpPoints = {
      vata: getPoint("vata", compareScores.vata || 33),
      pitta: getPoint("pitta", compareScores.pitta || 33),
      kapha: getPoint("kapha", compareScores.kapha || 33)
    };
    comparePath = `M ${cpPoints.vata.x} ${cpPoints.vata.y} L ${cpPoints.pitta.x} ${cpPoints.pitta.y} L ${cpPoints.kapha.x} ${cpPoints.kapha.y} Z`;
  }

  // Concentric background grid triangles (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid */}
        {gridLevels.map((lvl, idx) => {
          const r = radius * lvl;
          const pV = { x: center, y: center - r };
          const pP = { x: center + r * Math.cos(Math.PI / 6), y: center + r * Math.sin(Math.PI / 6) };
          const pK = { x: center + r * Math.cos((5 * Math.PI) / 6), y: center + r * Math.sin((5 * Math.PI) / 6) };
          return (
            <polygon
              key={idx}
              points={`${pV.x},${pV.y} ${pP.x},${pP.y} ${pK.x},${pK.y}`}
              fill={idx === 3 ? "#FDFBF7" : "none"}
              stroke="#E5E0D4"
              strokeWidth="1"
              strokeDasharray={idx < 3 ? "2,2" : "none"}
            />
          );
        })}

        {/* Axis Lines */}
        {["vata", "pitta", "kapha"].map((dosha) => {
          const edge = {
            x: center + radius * Math.cos(angles[dosha]),
            y: center + radius * Math.sin(angles[dosha])
          };
          return (
            <line
              key={dosha}
              x1={center}
              y1={center}
              x2={edge.x}
              y2={edge.y}
              stroke="#D3C9B8"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Comparative Overlay (if present) */}
        {comparePath && (
          <polygon
            points={comparePath.replace(/[MLZ]/g, "").trim()}
            fill="rgba(156, 163, 175, 0.25)"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeDasharray="4,3"
          />
        )}

        {/* Primary Assessment Polygon */}
        <polygon
          points={`${currentPoints.vata.x},${currentPoints.vata.y} ${currentPoints.pitta.x},${currentPoints.pitta.y} ${currentPoints.kapha.x},${currentPoints.kapha.y}`}
          fill="rgba(45, 106, 79, 0.22)"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {/* Vertex Markers */}
        <circle cx={currentPoints.vata.x} cy={currentPoints.vata.y} r="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx={currentPoints.pitta.x} cy={currentPoints.pitta.y} r="5" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx={currentPoints.kapha.x} cy={currentPoints.kapha.y} r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />

        {/* Center Point */}
        <circle cx={center} cy={center} r="3" fill="#A89F91" />
      </svg>

      {/* Outer Labels */}
      {showLabels && (
        <>
          {/* Vata Label (Top) */}
          <div
            className="absolute text-center"
            style={{ top: 4, left: "50%", transform: "translateX(-50%)" }}
          >
            <div className="text-xs font-bold text-sky-800 tracking-wide uppercase">Vata (वात)</div>
            <div className="text-sm font-extrabold text-sky-900">{scores.vata}%</div>
          </div>

          {/* Pitta Label (Bottom Right) */}
          <div
            className="absolute text-center"
            style={{ bottom: 8, right: 12 }}
          >
            <div className="text-xs font-bold text-amber-800 tracking-wide uppercase">Pitta (पित्त)</div>
            <div className="text-sm font-extrabold text-amber-900">{scores.pitta}%</div>
          </div>

          {/* Kapha Label (Bottom Left) */}
          <div
            className="absolute text-center"
            style={{ bottom: 8, left: 12 }}
          >
            <div className="text-xs font-bold text-emerald-800 tracking-wide uppercase">Kapha (कफ)</div>
            <div className="text-sm font-extrabold text-emerald-900">{scores.kapha}%</div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Linear Tri-Dosha Proportion Bar
 */
export function DoshaProportionBar({ scores, className = "h-4" }) {
  const v = scores.vata || 33.3;
  const p = scores.pitta || 33.3;
  const k = scores.kapha || 33.4;

  return (
    <div className={`w-full overflow-hidden rounded-full flex shadow-inner bg-stone-200 ${className}`}>
      <div
        style={{ width: `${v}%` }}
        className="bg-sky-500 transition-all duration-500 relative group flex items-center justify-center"
        title={`Vata: ${v}%`}
      >
        {v >= 15 && <span className="text-[10px] font-bold text-white drop-shadow">V: {v}%</span>}
      </div>
      <div
        style={{ width: `${p}%` }}
        className="bg-amber-500 transition-all duration-500 relative group flex items-center justify-center"
        title={`Pitta: ${p}%`}
      >
        {p >= 15 && <span className="text-[10px] font-bold text-white drop-shadow">P: {p}%</span>}
      </div>
      <div
        style={{ width: `${k}%` }}
        className="bg-emerald-600 transition-all duration-500 relative group flex items-center justify-center"
        title={`Kapha: ${k}%`}
      >
        {k >= 15 && <span className="text-[10px] font-bold text-white drop-shadow">K: {k}%</span>}
      </div>
    </div>
  );
}
