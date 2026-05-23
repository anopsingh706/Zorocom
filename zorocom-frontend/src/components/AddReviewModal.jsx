import React, { useState } from "react";
import { addReview } from "../services/api";
import { StarPicker } from "./StarRating";

export default function AddReviewModal({ company, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    subject: "",
    reviewText: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Your name is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.reviewText.trim()) e.reviewText = "Review text is required";
    if (form.rating < 1) e.rating = "Please select a rating";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const res = await addReview(company._id, form);
      onSuccess(res.data.data);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">✍️ Write a Review</h2>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 2 }}>
              for {company.name}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Star rating at top */}
              <div className="form-group">
                <label className="form-label">Your Rating *</label>
                <StarPicker
                  value={form.rating}
                  onChange={(r) => {
                    setForm((p) => ({ ...p, rating: r }));
                    if (errors.rating) setErrors((p) => ({ ...p, rating: null }));
                  }}
                />
                {errors.rating && (
                  <span style={{ fontSize: "0.78rem", color: "#f87171" }}>
                    {errors.rating}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="Full Name *"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ravi Sharma"
                  error={errors.fullName}
                />
                <Field
                  label="Subject *"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Great workplace"
                  error={errors.subject}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Review *</label>
                <textarea
                  className="form-input"
                  name="reviewText"
                  value={form.reviewText}
                  onChange={handleChange}
                  placeholder="Share your experience working at or with this company..."
                  rows={4}
                  style={errors.reviewText ? { borderColor: "#ef4444" } : {}}
                />
                {errors.reviewText && (
                  <span style={{ fontSize: "0.78rem", color: "#f87171" }}>
                    {errors.reviewText}
                  </span>
                )}
              </div>

              {errors.submit && (
                <div style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8, padding: "10px 14px",
                  color: "#f87171", fontSize: "0.88rem",
                }}>
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ height: 48, marginTop: 4 }}
              >
                {loading ? "Submitting..." : "Post Review"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, error }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={error ? { borderColor: "#ef4444" } : {}}
      />
      {error && (
        <span style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</span>
      )}
    </div>
  );
}
