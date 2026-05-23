import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StarDisplay } from "./StarRating";

export default function CompanyCard({ company, index }) {
  const [imgErr, setImgErr] = useState(false);

  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      to={`/company/${company._id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="card"
        style={{
          padding: "20px",
          cursor: "pointer",
          animation: `fadeIn 0.4s ease forwards`,
          animationDelay: `${index * 0.06}s`,
          opacity: 0,
        }}
      >
        {/* Top row: logo + info */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          {/* Logo */}
          <div
            style={{
              width: 52, height: 52, flexShrink: 0,
              borderRadius: 12,
              overflow: "hidden",
              background: "linear-gradient(135deg, #1e293b, #2d3f55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {company.logo && !imgErr ? (
              <img
                src={company.logo}
                alt={company.name}
                onError={() => setImgErr(true)}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }}
              />
            ) : (
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#f59e0b",
              }}>
                {initials}
              </span>
            )}
          </div>

          {/* Name + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: 3,
              }}
            >
              {company.name}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                📍 {company.city}
              </span>
              <span style={{ color: "#2d3f55", fontSize: "0.7rem" }}>•</span>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                Est. {company.foundedOn}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <span style={{ color: "#3d526a", fontSize: "1rem", flexShrink: 0, marginTop: 4 }}>→</span>
        </div>

        {/* Description */}
        {company.description && (
          <p
            style={{
              fontSize: "0.82rem",
              color: "#64748b",
              marginTop: 12,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {company.description}
          </p>
        )}

        {/* Bottom row: rating + reviews count */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <StarDisplay
            rating={company.averageRating || 0}
            count={company.totalReviews || 0}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "#475569",
              background: "rgba(255,255,255,0.04)",
              padding: "3px 10px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {company.totalReviews || 0} review{company.totalReviews !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
