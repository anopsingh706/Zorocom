import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Company from './models/Company.js';
import Review from './models/Review.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const companies = [
  {
    name: "HSBC",
    location: "London",
    foundedOn: "1865-03-03",
    city: "London",
    description: "One of the world's largest banking and financial services organizations.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/HSBC_logo_%282018%29.svg"
  },
  {
    name: "Nvidia",
    location: "California",
    foundedOn: "1993-04-05",
    city: "Santa Clara",
    description: "The pioneer of GPU-accelerated computing and a leader in AI and deep learning.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg"
  },
  {
    name: "IBM",
    location: "New York",
    foundedOn: "1911-06-16",
    city: "Armonk",
    description: "A global technology and innovation company, the largest technology and consulting employer in the world.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
  },
  {
    name: "Microsoft",
    location: "Washington",
    foundedOn: "1975-04-04",
    city: "Redmond",
    description: "A world leader in software, services, devices, and solutions that help people and businesses realize their full potential.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
  },
  {
    name: "Cognizant",
    location: "New Jersey",
    foundedOn: "1994-01-26",
    city: "Teaneck",
    description: "A leading professional services company, transforming clients' business, operating and technology models for the digital era.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg"
  },
  {
    name: "Capgemini",
    location: "Paris",
    foundedOn: "1967-10-01",
    city: "Paris",
    description: "A global leader in partnering with companies to transform and manage their business by harnessing the power of technology.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg"
  },
  {
    name: "Accenture",
    location: "Dublin",
    foundedOn: "1989-01-01",
    city: "Dublin",
    description: "A professional services company that provides services in strategy, consulting, digital, technology and operations.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg"
  },
  {
    name: "Wipro",
    location: "Karnataka",
    foundedOn: "1945-12-29",
    city: "Bangalore",
    description: "A leading global information technology, consulting and business process services company.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg"
  },
  {
    name: "Infosys",
    location: "Karnataka",
    foundedOn: "1981-07-02",
    city: "Bangalore",
    description: "A global leader in next-generation digital services and consulting.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
  }
];

const reviews = [
  { fullName: "Alex Rivera", subject: "Incredible Innovation", reviewText: "The pace of innovation here is unmatched. Every day is a learning experience.", rating: 5 },
  { fullName: "Samantha Reed", subject: "Great Work-Life Balance", reviewText: "I love the flexibility and the focus on employee well-being.", rating: 4 },
  { fullName: "Liam Chen", subject: "Technical Excellence", reviewText: "Surrounded by some of the brightest minds in the industry.", rating: 5 },
  { fullName: "Emma Watson", subject: "Inclusive Culture", reviewText: "A very diverse and welcoming workplace for everyone.", rating: 5 },
  { fullName: "Noah Kim", subject: "Challenging Projects", reviewText: "The projects are tough but the growth you get is worth it.", rating: 4 }
];

const seedData = async () => {
  try {
    await Company.deleteMany();
    await Review.deleteMany();
    console.log('Old data removed');

    const createdCompanies = await Company.insertMany(companies);
    console.log(`${companies.length} Real Companies added!`);

    for (const company of createdCompanies) {
      const companyReviews = [];
      for (let i = 0; i < 3; i++) {
        const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
        companyReviews.push({
          ...randomReview,
          companyId: company._id
        });
      }
      await Review.insertMany(companyReviews);
    }
    
    console.log('Reviews seeded for all companies!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
