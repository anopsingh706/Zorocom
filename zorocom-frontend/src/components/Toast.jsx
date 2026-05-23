import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span style={{ fontSize: "1.2rem" }}>
        {type === "success" ? "✅" : "❌"}
      </span>
      <span style={{ fontSize: "0.9rem", flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}
