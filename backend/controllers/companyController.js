import Company from '../models/Company.js';

// @desc    Create a new company
// @route   POST /api/companies
// @access  Public
const createCompany = async (req, res) => {
  try {
    const { name, location, foundedOn, city, description } = req.body;

    const company = new Company({
      name,
      location,
      foundedOn,
      city,
      description,
      logoUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });

    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all companies with search, filter and sort
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  try {
    const { search, city, sort } = req.query;
    
    // Base aggregation pipeline
    let pipeline = [];

    // Search and Filter
    let match = {};
    if (search) {
      match.name = { $regex: search, $options: 'i' };
    }
    if (city) {
      match.city = city;
    }
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // Lookup reviews to calculate average rating
    pipeline.push({
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'companyId',
        as: 'reviews'
      }
    });

    // Project fields and calculate average
    pipeline.push({
      $addFields: {
        averageRating: {
          $cond: [
            { $eq: [{ $size: '$reviews' }, 0] },
            0,
            { $avg: '$reviews.rating' }
          ]
        },
        totalReviews: { $size: '$reviews' }
      }
    });

    // Sorting
    let sortQuery = { createdAt: -1 }; // default
    if (sort === 'name') {
      sortQuery = { name: 1 };
    } else if (sort === 'rating') {
      sortQuery = { averageRating: -1 };
    }
    pipeline.push({ $sort: sortQuery });

    const companies = await Company.aggregate(pipeline);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createCompany, getCompanies, getCompanyById };
