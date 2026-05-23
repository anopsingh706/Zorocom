const mongoose = require("mongoose");

// 📌 CONCEPT: Mongoose Schema
// A schema defines the "shape" of documents in a MongoDB collection.
// Think of it like a blueprint or a class — every company document
// stored in the DB will follow this structure.

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,           // removes leading/trailing whitespace
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    foundedOn: {
      type: Number,         // storing the founding year (e.g., 2015)
      required: [true, "Founded year is required"],
    },
    logo: {
      type: String,         // URL string for the company logo
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // 📌 CONCEPT: Derived/Computed fields stored in DB
    // Instead of calculating average rating on every read request,
    // we store it and update it whenever a new review is added.
    // This is a classic performance trade-off called "denormalization".
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    // 📌 CONCEPT: Timestamps option
    // Mongoose automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// 📌 CONCEPT: mongoose.model()
// This compiles the schema into a Model. A Model is what you use to
// actually interact with the database — create, read, update, delete.
// First arg = model name (Mongoose pluralizes it → "companies" collection)
const Company = mongoose.model("Company", companySchema);

module.exports = Company;
