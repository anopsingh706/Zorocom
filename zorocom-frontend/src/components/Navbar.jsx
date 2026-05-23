import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ZorocomLogo from "./ZorocomLogo";

export default function Navbar({ onAddCompany }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: 68,
        background: scrolled
          ? "rgba(15,23,42,0.96)"
          : "rgba(15,23,42,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
        transition: "all 0.25s ease",
      }}
    >
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/">
          <ZorocomLogo size="sm" />
        </Link>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isHome && (
            <Link to="/" className="btn btn-ghost btn-sm">
              ← Companies
            </Link>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={onAddCompany}
          >
            <span>+</span>
            <span>Add Company</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
