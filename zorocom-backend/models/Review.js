const mongoose = require("mongoose");

// 📌 CONCEPT: Referenced vs Embedded Documents
// In MongoDB you have two ways to relate data:
//   1. EMBED  — store reviews inside the company document (nested array)
//   2. REFERENCE — store reviews in a separate collection, linked by company ID
//
// We use REFERENCE here because:
//   - A company can have hundreds of reviews (embedded docs have a 16MB doc limit)
//   - We want to query/sort reviews independently
//   - Easier pagination

const reviewSchema = new mongoose.Schema(
  {
    // 📌 CONCEPT: ObjectId Reference (Foreign Key equivalent in MongoDB)
    // ref: "Company" tells Mongoose which model this ID points to.
    // This enables `.populate()` — fetching full company data in one query.
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 📌 CONCEPT: Mongoose Middleware (Post Hook)
// This runs AFTER a review is saved. We use it to recalculate
// and update the parent company's averageRating and totalReviews.
// This is called a "post-save hook" — a powerful pattern for
// keeping derived data in sync automatically.
reviewSchema.post("save", async function () {
  const Review = this.constructor; // 'this' refers to the saved review doc

  // Aggregate: group all reviews for this company and compute avg rating
  const stats = await Review.aggregate([
    { $match: { company: this.company } },
    {
      $group: {
        _id: "$company",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Company").findByIdAndUpdate(this.company, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10, // round to 1 decimal
      totalReviews: stats[0].count,
    });
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
