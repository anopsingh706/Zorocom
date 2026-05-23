const express = require("express");
const router = express.Router();

const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require("../controllers/companyController");

const { addReview, getReviews, likeReview } = require("../controllers/reviewController");

// 📌 CONCEPT: Express Router
// Instead of defining all routes in server.js, we use a Router to
// group related routes together. This keeps the codebase modular.
// In server.js we'll mount this router at "/api/companies",
// so all these paths are RELATIVE to that base path.

// ── Company Routes ──────────────────────────
// POST   /api/companies         → create a new company
// GET    /api/companies         → get all companies (with search/filter)
// GET    /api/companies/:id     → get single company
router.route("/").post(createCompany).get(getCompanies);
router.route("/:id").get(getCompanyById);

// ── Review Routes (nested under company) ────
// POST   /api/companies/:id/reviews                      → add review
// GET    /api/companies/:id/reviews                      → get reviews
// PUT    /api/companies/:id/reviews/:reviewId/like       → like a review
router.route("/:id/reviews").post(addReview).get(getReviews);
router.route("/:id/reviews/:reviewId/like").put(likeReview);

module.exports = router;
