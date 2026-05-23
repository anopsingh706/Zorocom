import React from "react";

// Zorocom wordmark with a geometric Z-bolt as the logomark
export default function ZorocomLogo({ size = "md", showText = true }) {
  const sizes = {
    sm: { mark: 28, fontSize: "1.1rem", gap: 8 },
    md: { mark: 38, fontSize: "1.4rem", gap: 10 },
    lg: { mark: 52, fontSize: "2rem", gap: 14 },
    xl: { mark: 72, fontSize: "2.8rem", gap: 18 },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        userSelect: "none",
      }}
    >
      {/* ── Z-bolt logomark ── */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagonal shape */}
        <path
          d="M24 2L44 13V35L24 46L4 35V13L24 2Z"
          fill="#0f172a"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        {/* Amber gradient background fill */}
        <defs>
          <linearGradient id="zGrad" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="hexFill" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path
          d="M24 2L44 13V35L24 46L4 35V13L24 2Z"
          fill="url(#hexFill)"
          stroke="url(#zGrad)"
          strokeWidth="2"
        />
        {/* Z bolt lightning shape */}
        <path
          d="M32 12H18L14 24H22L16 36L34 20H25L32 12Z"
          fill="url(#zGrad)"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: s.fontSize,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          zoro
          <span
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            com
          </span>
        </span>
      )}
    </div>
  );
}
