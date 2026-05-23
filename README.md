# 💤 Zorocom — Company Review & Rating Platform ☑

✅**LIVE** : https://zorocom.vercel.app/

A full-stack MERN application where users can discover companies, read reviews, and share their workplace experiences.

---

## 📁 Project Structure

```
zorocom/
├── zorocom-backend/        ← Express + MongoDB API
│   ├── config/db.js
│   ├── models/
│   │   ├── Company.js
│   │   └── Review.js
│   ├── controllers/
│   │   ├── companyController.js
│   │   └── reviewController.js
│   ├── routes/companyRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── zorocom-frontend/       ← React app
    ├── public/index.html
    ├── src/
    │   ├── components/
    │   │   ├── ZorocomLogo.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── CompanyCard.jsx
    │   │   ├── ReviewCard.jsx
    │   │   ├── StarRating.jsx
    │   │   ├── AddCompanyModal.jsx
    │   │   ├── AddReviewModal.jsx
    │   │   └── Toast.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   └── CompanyPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── seedData.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free at cloud.mongodb.com)

---

### Step 1 — MongoDB Atlas Setup

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a **free M0 cluster**
3. Go to **Database Access** → Add a user with read/write privileges
4. Go to **Network Access** → Add IP `0.0.0.0/0` (allow all) for development
5. Go to **Connect** → **Drivers** → Copy your connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### Step 2 — Backend Setup

```bash
# Navigate to backend folder
cd zorocom-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/zorocom?retryWrites=true&w=majority
# PORT=5000

# Start development server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

### Step 3 — Frontend Setup

```bash
# Open a NEW terminal tab, navigate to frontend
cd zorocom-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# (Default REACT_APP_API_URL=http://localhost:5000/api is correct for local dev)

# Start React app
npm start
```

The app opens at **http://localhost:3000** 🎉

---

## 🌐 Features

| Feature | Details |
|---------|---------|
| **Company Listing** | Grid view with search by name and filter by city |
| **Sort Companies** | By newest, A–Z, top rated, oldest |
| **Add Company** | Form with name, location, city, founded year, logo, description |
| **Auto Logo** | Automatically fetches logo from Clearbit if not provided |
| **Default Data** | 7 companies seeded on first load (Google, Microsoft, Apple, etc.) |
| **Company Detail** | Full profile with rating breakdown chart |
| **Write Reviews** | Full name, subject, star rating, review text |
| **Sort Reviews** | By newest, oldest, highest rated, lowest rated, most helpful |
| **Like Reviews** | Thumbs up a review to mark it as helpful |
| **Average Rating** | Auto-calculated and displayed on listing + detail pages |
| **Mobile-First** | Fully responsive from 320px to 1440px |
| **Modals** | Bottom-sheet style on mobile, centered on desktop |

---

## 📡 API Reference

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/companies` | Create a company |
| `GET` | `/api/companies` | List companies |
| `GET` | `/api/companies?search=google` | Search by name |
| `GET` | `/api/companies?city=Bangalore` | Filter by city |
| `GET` | `/api/companies?sortBy=rating` | Sort results |
| `GET` | `/api/companies/:id` | Get single company |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/companies/:id/reviews` | Add a review |
| `GET` | `/api/companies/:id/reviews` | Get reviews |
| `GET` | `/api/companies/:id/reviews?sortBy=rating_high` | Sort reviews |
| `PUT` | `/api/companies/:id/reviews/:reviewId/like` | Like a review |

---

## 🧠 Tech Concepts Used

- **MVC Pattern** — Models, Controllers, Routes separated
- **Mongoose Schemas** — with validation, defaults, timestamps
- **Post-Save Hook** — auto-updates company average rating after each review
- **$inc Atomic Operator** — thread-safe like counter
- **Debouncing** — search input waits 400ms before querying
- **CORS** — allows cross-origin requests between frontend and backend
- **dotenv** — keeps secrets out of source code
- **React Router v6** — client-side routing
- **Axios** — HTTP client with centralized base URL
- **Auto-seeding** — seeds 7 companies on first run if DB is empty

---

## 🎨 Design System

- **Fonts**: Syne (display/headings) + DM Sans (body)
- **Colors**: Deep Navy (`#0f172a`) + Amber (`#f59e0b`)
- **Components**: Cards, Modals, Toasts, Star Picker, Rating Distribution Bar
- **Animations**: Staggered card entrance, modal slide-up, hover transforms
- **Mobile**: Bottom-sheet modals, responsive grid (1 col → 3 col)

---

## 📝 Notes

- `.env` files are excluded from git (never commit secrets!)
- The frontend auto-seeds 7 companies if the database is empty on first load
- Logo images use Clearbit's free logo API (requires internet connection)
- For production deployment, update `REACT_APP_API_URL` to your hosted backend URL
