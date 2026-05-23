import express from 'express';
import {
  createReview,
  getReviewsByCompany,
  likeReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/').post(createReview);
router.route('/company/:companyId').get(getReviewsByCompany);
router.route('/:id/like').patch(likeReview);

export default router;
