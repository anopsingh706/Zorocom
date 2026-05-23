const Review = require("../models/Review");
const Company = require("../models/Company");

// ─────────────────────────────────────────────
// @desc    Add a review for a company
// @route   POST /api/companies/:id/reviews
// @access  Public
// ─────────────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const companyId = req.params.id;

    // First verify the company actually exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const { fullName, subject, reviewText, rating } = req.body;

    // 📌 CONCEPT: Creating a document with a reference
    // We store the companyId so every review "belongs to" a company.
    // This is like a foreign key in relational DBs (SQL).
    const review = await Review.create({
      company: companyId,
      fullName,
      subject,
      reviewText,
      rating,
    });

    // Note: The post-save hook in Review.js automatically updates
    // averageRating and totalReviews on the Company document.

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all reviews for a company
// @route   GET /api/companies/:id/reviews?sortBy=date
// @access  Public
// ─────────────────────────────────────────────
const getReviews = async (req, res) => {
  try {
    const companyId = req.params.id;

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const { sortBy } = req.query;

    // 📌 CONCEPT: Sorting strategies
    // "relevance" here = most liked reviews first (likes desc)
    let sort = { createdAt: -1 }; // default: newest first
    if (sortBy === "rating_high") sort = { rating: -1 };
    if (sortBy === "rating_low") sort = { rating: 1 };
    if (sortBy === "oldest") sort = { createdAt: 1 };
    if (sortBy === "relevance") sort = { likes: -1 };

    const reviews = await Review.find({ company: companyId }).sort(sort);

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: company.averageRating,
      totalReviews: company.totalReviews,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Like a review (increment like count)
// @route   PUT /api/companies/:id/reviews/:reviewId/like
// @access  Public
// ─────────────────────────────────────────────
const likeReview = async (req, res) => {
  try {
    // 📌 CONCEPT: $inc operator
    // MongoDB's $inc atomically increments a field by the given value.
    // "Atomic" means it's thread-safe — no race condition even with
    // concurrent requests. Much safer than: review.likes++; review.save()
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { likes: 1 } },
      { new: true } // return the updated document, not the old one
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review liked",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addReview, getReviews, likeReview };
