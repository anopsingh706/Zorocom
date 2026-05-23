import axios from "axios";

// 📌 CONCEPT: Centralized API layer
// All backend calls go through this file. If the base URL ever changes,
// you only update it in ONE place — not scattered across every component.

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Company APIs ──────────────────────────────────────────────────

export const createCompany = (data) => API.post("/companies", data);

export const getCompanies = (params = {}) =>
  API.get("/companies", { params });

export const getCompanyById = (id) => API.get(`/companies/${id}`);

// ── Review APIs ───────────────────────────────────────────────────

export const addReview = (companyId, data) =>
  API.post(`/companies/${companyId}/reviews`, data);

export const getReviews = (companyId, params = {}) =>
  API.get(`/companies/${companyId}/reviews`, { params });

export const likeReview = (companyId, reviewId) =>
  API.put(`/companies/${companyId}/reviews/${reviewId}/like`);
