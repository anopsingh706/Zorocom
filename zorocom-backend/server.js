const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 📌 CONCEPT: dotenv
// Loads environment variables from the .env file into process.env
// This keeps secrets (like DB passwords) OUT of your source code.
// ALWAYS add .env to .gitignore — never commit it to GitHub!
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────────────
// 📌 CONCEPT: Middleware
// Middleware are functions that run on EVERY request before it reaches
// your route handlers. Think of them as a pipeline.
//
// Request → [cors] → [express.json] → [your route handler] → Response

// cors: Allows your React frontend (running on port 3000) to make
//       requests to this backend (port 5000). Without this, browsers
//       block cross-origin requests for security reasons.
app.use(cors());

// express.json(): Parses incoming JSON request bodies.
// Without this, req.body would be undefined.
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
// Mount the company router at the /api/companies base path.
// Every route defined in companyRoutes.js will be prefixed with this.
app.use("/api/companies", require("./routes/companyRoutes"));

// Health check route — useful to verify the server is running
app.get("/", (req, res) => {
  res.json({ message: "🚀 Zorocom API is running!" });
});

// ── 404 Handler ───────────────────────────────────────────────────
// If no route matched, send a 404 response.
// This middleware runs only if nothing above handled the request.
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
