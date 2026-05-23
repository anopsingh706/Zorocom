import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById, getReviews } from "../services/api";
import { StarDisplay } from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import AddReviewModal from "../components/AddReviewModal";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating_high", label: "Highest Rated" },
  { value: "rating_low", label: "Lowest Rated" },
  { value: "relevance", label: "Most Helpful" },
];

export default function CompanyPage({ onToast }) {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const fetchCompany = useCallback(async () => {
    try {
      const res = await getCompanyById(id);
      setCompany(res.data.data);
    } catch {
      onToast("Company not found", "error");
    }
  }, [id, onToast]);

  const fetchReviews = useCallback(async () => {
    setReviewLoading(true);
    try {
      const params = sortBy !== "newest" ? { sortBy } : {};
      const res = await getReviews(id, params);
      setReviews(res.data.data);
    } catch {
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  }, [id, sortBy]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCompany();
      await fetchReviews();
      setLoading(false);
    };
    load();
  }, [id]); // eslint-disable-line

  useEffect(() => {
    if (!loading) fetchReviews();
  }, [sortBy]); // eslint-disable-line

  const handleReviewAdded = (newReview) => {
    setShowReviewModal(false);
    setReviews((prev) => [newReview, ...prev]);
    // Re-fetch company to get updated averageRating
    fetchCompany();
    onToast("Review posted successfully! 🎉", "success");
  };

  const handleLike = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId ? { ...r, likes: r.likes + 1 } : r
      )
    );
  };

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 32 }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="icon">😕</div>
            <h3>Company not found</h3>
          </div>
        </div>
      </div>
    );
  }

  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page" style={{ paddingBottom: 64 }}>
      {/* ── Company Header ─────────────────────── */}
      <section
        style={{
          background: "linear-gradient(180deg, rgba(30,41,59,0.8) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: 72, height: 72, flexShrink: 0,
                borderRadius: 16,
                background: "linear-gradient(135deg, #1e293b, #2d3f55)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              {company.logo && !imgErr ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  onError={() => setImgErr(true)}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                />
              ) : (
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800, fontSize: "1.5rem", color: "#f59e0b",
                }}>
                  {initials}
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.4rem, 4vw, 2rem)",
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                {company.name}
              </h1>

              <div
                style={{
                  display: "flex", flexWrap: "wrap",
                  gap: 12, marginBottom: 10,
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                  📍 {company.location}
                </span>
                <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                  🏛️ Est. {company.foundedOn}
                </span>
              </div>

              <StarDisplay
                rating={company.averageRating || 0}
                count={company.totalReviews || 0}
                size="1.1rem"
              />

              {company.description && (
                <p
                  style={{
                    fontSize: "0.88rem", color: "#64748b",
                    marginTop: 10, lineHeight: 1.6,
                    maxWidth: 560,
                  }}
                >
                  {company.description}
                </p>
              )}
            </div>

            {/* CTA */}
            <button
              className="btn btn-primary"
              onClick={() => setShowReviewModal(true)}
              style={{ flexShrink: 0 }}
            >
              ✍️ Write a Review
            </button>
          </div>
        </div>
      </section>

      {/* ── Reviews Section ────────────────────── */}
      <div className="container" style={{ marginTop: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: reviews.length > 0 ? "1fr" : "1fr",
            gap: 24,
          }}
        >
          {/* Rating overview + Sort controls */}
          {reviews.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                alignItems: "flex-start",
                background: "rgba(30,41,59,0.5)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 4,
              }}
            >
              {/* Big average */}
              <div style={{ textAlign: "center", minWidth: 90 }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "3rem",
                    color: "#f59e0b",
                    lineHeight: 1,
                  }}
                >
                  {(company.averageRating || 0).toFixed(1)}
                </div>
                <StarDisplay
                  rating={company.averageRating || 0}
                  showCount={false}
                  size="0.9rem"
                />
                <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: 4 }}>
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Distribution bars */}
              <div style={{ flex: 1, minWidth: 160 }}>
                {ratingDist.map(({ star, count, pct }) => (
                  <div
                    key={star}
                    style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "#64748b", width: 12 }}>
                      {star}
                    </span>
                    <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>★</span>
                    <div
                      style={{
                        flex: 1, height: 6, background: "#1e293b",
                        borderRadius: 100, overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`, height: "100%",
                          background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                          borderRadius: 100,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#475569", width: 16 }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sort + Review count header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#e2e8f0",
              }}
            >
              {reviews.length > 0 ? `Reviews (${reviews.length})` : "No reviews yet"}
            </h2>

            {reviews.length > 1 && (
              <select
                className="form-input"
                style={{
                  width: "auto", background: "rgba(15,23,42,0.6)",
                  cursor: "pointer", fontSize: "0.85rem", padding: "8px 12px",
                }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Review cards or empty */}
          {reviewLoading ? (
            <div className="spinner" />
          ) : reviews.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💬</div>
              <h3>Be the first to review</h3>
              <p>Share your experience with {company.name}</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowReviewModal(true)}
                style={{ marginTop: 20 }}
              >
                ✍️ Write Review
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviews.map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  companyId={company._id}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <AddReviewModal
          company={company}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleReviewAdded}
        />
      )}
    </div>
  );
}
