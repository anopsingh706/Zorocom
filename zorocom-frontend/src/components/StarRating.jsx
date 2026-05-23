import React, { useState } from "react";

export function StarDisplay({ rating, size = "1rem", showCount, count }) {
  const filled = Math.round(rating);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            style={{
              fontSize: size,
              color: n <= filled ? "#f59e0b" : "#2d3f55",
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
      </div>
      {showCount !== false && rating > 0 && (
        <span
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginLeft: 4,
          }}
        >
          {rating.toFixed(1)}
          {count !== undefined && (
            <span style={{ marginLeft: 4 }}>({count})</span>
          )}
        </span>
      )}
    </div>
  );
}

export function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: n <= (hover || value) ? "#f59e0b" : "#2d3f55",
            transition: "color 0.15s ease, transform 0.1s ease",
            transform: hover >= n ? "scale(1.2)" : "scale(1)",
            padding: "2px 4px",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
