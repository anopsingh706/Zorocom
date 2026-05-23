import Review from '../models/Review.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  try {
    const { companyId, fullName, subject, reviewText, rating } = req.body;

    const review = new Review({
      companyId,
      fullName,
      subject,
      reviewText,
      rating,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get reviews by company ID with sorting and average rating
// @route   GET /api/reviews/company/:companyId
// @access  Public
const getReviewsByCompany = async (req, res) => {
  try {
    const { sort } = req.query;
    let sortQuery = { createdAt: -1 }; // default: newest first

    if (sort === 'rating') {
      sortQuery = { rating: -1 };
    } else if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    const reviews = await Review.find({ companyId: req.params.companyId }).sort(
      sortQuery
    );

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a review
// @route   PATCH /api/reviews/:id/like
// @access  Public
const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      review.likes += 1;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createReview, getReviewsByCompany, likeReview };
