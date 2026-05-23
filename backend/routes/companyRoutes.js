import express from 'express';
import {
  createCompany,
  getCompanies,
  getCompanyById,
} from '../controllers/companyController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.route('/').get(getCompanies).post(upload.single('logo'), createCompany);
router.route('/:id').get(getCompanyById);

export default router;
