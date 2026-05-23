import React from "react";
import { StarDisplay } from "./StarRating";
import { likeReview } from "../services/api";

export default function ReviewCard({ review, companyId, onLike }) {
  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await likeReview(companyId, review._id);
      onLike(review._id);
    } catch (_) {}
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr);
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  // Generate consistent avatar color from name
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316"];
  const colorIdx =
    review.fullName.charCodeAt(0) % colors.length;

  return (
    <div
      className="card"
      style={{ padding: "18px 20px" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar */}
          <div
            style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: `${colors[colorIdx]}22`,
              border: `2px solid ${colors[colorIdx]}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "0.95rem",
              color: colors[colorIdx],
            }}
          >
            {review.fullName[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#e2e8f0" }}>
              {review.fullName}
            </div>
            <StarDisplay rating={review.rating} showCount={false} size="0.8rem" />
          </div>
        </div>
        <span style={{ fontSize: "0.75rem", color: "#475569", flexShrink: 0 }}>
          {timeAgo(review.createdAt)}
        </span>
      </div>

      {/* Subject */}
      <h4
        style={{
          fontSize: "0.95rem",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          color: "#f1f5f9",
          marginTop: 14,
          marginBottom: 6,
        }}
      >
        {review.subject}
      </h4>

      {/* Review text */}
      <p style={{ fontSize: "0.87rem", color: "#94a3b8", lineHeight: 1.6 }}>
        {review.reviewText}
      </p>

      {/* Footer: like button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <button
          onClick={handleLike}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 100,
            color: "#64748b",
            fontSize: "0.8rem",
            padding: "5px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
            e.currentTarget.style.color = "#f59e0b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <span>👍</span>
          <span>Helpful ({review.likes})</span>
        </button>
      </div>
    </div>
  );
}
