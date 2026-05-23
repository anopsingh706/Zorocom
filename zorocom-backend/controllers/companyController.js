const Company = require("../models/Company");

// 📌 CONCEPT: Controller
// A controller contains the actual "business logic" — what should happen
// when a route is hit. Separating controllers from routes keeps code
// organized and follows the MVC (Model-View-Controller) pattern.
// Route → Controller → Model → Database

// ─────────────────────────────────────────────
// @desc    Create a new company
// @route   POST /api/companies
// @access  Public
// ─────────────────────────────────────────────
const createCompany = async (req, res) => {
  try {
    // 📌 CONCEPT: Destructuring
    // We extract only the fields we need from req.body.
    // This prevents accidentally saving unwanted fields (mass assignment).
    const { name, location, city, foundedOn, logo, description } = req.body;

    const company = await Company.create({
      name,
      location,
      city,
      foundedOn,
      logo,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    // Handle duplicate company name (MongoDB unique index error code: 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A company with this name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all companies (with search & filter)
// @route   GET /api/companies?search=google&city=Mumbai&sortBy=name
// @access  Public
// ─────────────────────────────────────────────
const getCompanies = async (req, res) => {
  try {
    // 📌 CONCEPT: Query Parameters
    // ?search=google  → req.query.search = "google"
    // ?city=Mumbai    → req.query.city = "Mumbai"
    // ?sortBy=rating  → req.query.sortBy = "rating"
    const { search, city, sortBy } = req.query;

    // 📌 CONCEPT: Building a dynamic query object
    // We start with an empty filter and add conditions only if the
    // corresponding query param was actually provided.
    let filter = {};

    if (search) {
      // $regex = like SQL's LIKE; $options: "i" = case-insensitive
      filter.name = { $regex: search, $options: "i" };
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    // 📌 CONCEPT: Sort object
    // MongoDB sort: 1 = ascending, -1 = descending
    let sort = { createdAt: -1 }; // default: newest first

    if (sortBy === "name") sort = { name: 1 };
    if (sortBy === "rating") sort = { averageRating: -1 };
    if (sortBy === "oldest") sort = { foundedOn: 1 };

    const companies = await Company.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get single company by ID
// @route   GET /api/companies/:id
// @access  Public
// ─────────────────────────────────────────────
const getCompanyById = async (req, res) => {
  try {
    // req.params.id comes from the :id in the route definition
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
};
