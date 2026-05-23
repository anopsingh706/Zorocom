import React, { useState, useEffect, useCallback } from "react";
import { getCompanies, createCompany } from "../services/api";
import { SEED_COMPANIES } from "../services/seedData";
import CompanyCard from "../components/CompanyCard";
import ZorocomLogo from "../components/ZorocomLogo";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name", label: "A–Z" },
  { value: "rating", label: "Top Rated" },
  { value: "oldest", label: "Oldest" },
];

export default function HomePage({ onAddCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input — wait 400ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCompanies = useCallback(async () => {
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (city) params.city = city;
      if (sortBy !== "newest") params.sortBy = sortBy;

      const res = await getCompanies(params);
      const data = res.data.data;

      // If DB is empty on first load, seed the default companies
      if (data.length === 0 && !debouncedSearch && !city) {
        await seedDefaultCompanies();
      } else {
        setCompanies(data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [debouncedSearch, city, sortBy]);

  const seedDefaultCompanies = async () => {
    setSeeding(true);
    try {
      const promises = SEED_COMPANIES.map((c) =>
        createCompany(c).catch(() => null) // ignore duplicate errors
      );
      await Promise.all(promises);
      // Re-fetch after seeding
      const res = await getCompanies({});
      setCompanies(res.data.data);
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const isFiltering = debouncedSearch || city;

  return (
    <div className="page" style={{ paddingBottom: 64 }}>
      {/* ── Hero ───────────────────────────────── */}
      <section
        style={{
          paddingTop: 48,
          paddingBottom: 48,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600, height: 300,
            background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          {/* Big logo */}
          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
          >
            <ZorocomLogo size="xl" />
          </div>

          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
              maxWidth: 480,
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Discover and evaluate companies through{" "}
            <span style={{ color: "#f59e0b" }}>authentic employee reviews</span> and ratings.
          </p>

          {/* Stats bar */}
          <div
            style={{
              display: "inline-flex",
              gap: 0,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 100,
              padding: "8px 24px",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
              <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                {companies.length}
              </span>{" "}
              companies listed
            </span>
          </div>
        </div>
      </section>

      {/* ── Search & Filter ────────────────────── */}
      <div className="container" style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(30,41,59,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute", left: 14, top: "50%",
                transform: "translateY(-50%)",
                color: "#475569", fontSize: "1rem",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              className="form-input"
              style={{ paddingLeft: 40, background: "rgba(15,23,42,0.6)" }}
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* City filter + Sort — row on desktop, column on mobile */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="form-input"
              style={{ flex: 1, minWidth: 120, background: "rgba(15,23,42,0.6)" }}
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select
              className="form-input"
              style={{
                flex: "0 0 auto", width: "auto",
                background: "rgba(15,23,42,0.6)",
                cursor: "pointer",
                appearance: "none",
                paddingRight: 32,
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {isFiltering && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(""); setCity(""); }}
                style={{ flexShrink: 0 }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Company Grid ───────────────────────── */}
      <div className="container">
        {loading || seeding ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="spinner" />
            <p style={{ color: "#475569", fontSize: "0.88rem", marginTop: 8 }}>
              {seeding ? "Setting up companies..." : "Loading..."}
            </p>
          </div>
        ) : companies.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏢</div>
            <h3>No companies found</h3>
            <p>
              {isFiltering
                ? "Try adjusting your search or filters"
                : "Be the first to add a company!"}
            </p>
            {!isFiltering && (
              <button
                className="btn btn-primary"
                onClick={onAddCompany}
                style={{ marginTop: 20 }}
              >
                + Add Company
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {companies.map((c, i) => (
              <CompanyCard key={c._id} company={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
