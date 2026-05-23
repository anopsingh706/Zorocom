import React, { useState } from "react";
import { createCompany } from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function AddCompanyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    city: "",
    foundedOn: "",
    logo: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Company name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.foundedOn) e.foundedOn = "Founded year is required";
    else if (form.foundedOn < 1800 || form.foundedOn > CURRENT_YEAR)
      e.foundedOn = `Year must be between 1800 and ${CURRENT_YEAR}`;
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
      const payload = {
        ...form,
        foundedOn: Number(form.foundedOn),
        // Auto-generate logo from Clearbit if user didn't provide one
        logo:
          form.logo.trim() ||
          `https://logo.clearbit.com/${form.name
            .toLowerCase()
            .replace(/\s+/g, "")}.com`,
      };
      const res = await createCompany(payload);
      onSuccess(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  // Close on overlay click
  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">🏢 Add Company</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <Field
                label="Company Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                error={errors.name}
              />

              <Field
                label="Location / Address *"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. 123 MG Road, Bangalore"
                error={errors.location}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="City *"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  error={errors.city}
                />
                <Field
                  label="Founded Year *"
                  name="foundedOn"
                  type="number"
                  value={form.foundedOn}
                  onChange={handleChange}
                  placeholder="e.g. 2010"
                  error={errors.foundedOn}
                />
              </div>

              <Field
                label="Logo URL"
                name="logo"
                value={form.logo}
                onChange={handleChange}
                placeholder="https://... (optional)"
                error={errors.logo}
              />
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: -8 }}>
                Leave blank to auto-fetch logo from the company name
              </p>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of the company..."
                  rows={3}
                />
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
                style={{ marginTop: 4, height: 48 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 16, height: 16,
                      border: "2px solid rgba(15,23,42,0.4)",
                      borderTopColor: "#0f172a",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Creating...
                  </span>
                ) : (
                  "Create Company Profile"
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, error, type = "text" }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
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
