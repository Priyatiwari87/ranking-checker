# RankCheck — Business Search Ranking Checker

RankCheck is a production-quality full-stack web application built with React, Vite, Tailwind CSS, Express.js, and MongoDB. It enables business owners and SEO professionals to inspect search engine ranking positions for their business websites across organic search results.

---

## 🌟 Key Features

1. **Pluggable Ranking Engine Architecture**:
   - Clean separation between core ranking matching logic and search providers using an **Adapter Pattern**.
   - Includes **Demo Mode Provider** (clearly labeled as simulated SERP data) and **SerpApi Provider** for live Google Search/SERP data.
   - Zero frontend code changes required to plug in Google Maps, local search, or custom SERP providers.

2. **Domain Normalization & Smart Matching**:
   - Converts URLs (`https://www.abccafe.com/menu?ref=1`) to canonical domain names (`abccafe.com`).
   - Accurately checks exact host and subdomain matches while ignoring protocol (`http/https`), trailing slashes, and parameter noise.

3. **Executive Dashboard & Real Trend Analytics**:
   - Real-time summary cards: **Total Checks**, **Successful Checks**, **Not Found**, and **Average Rank**.
   - Visual trend bar charts calculated **strictly from real stored checks**.
   - Position change tracking (`#8 → #5`, `Improved by 3 positions`).

4. **Interactive Search & Multi-Step Loader**:
   - Comprehensive form validation on both React frontend and Express backend.
   - Multi-step progress animation (*Preparing search*, *Fetching results*, *Analyzing rankings*, *Matching domain*, *Preparing report*).
   - Detailed SERP results table highlighting the target website position.

5. **Search History & Data Management**:
   - Full MongoDB database integration with in-memory fallback mode.
   - Filter, search, paginate, recheck queries, and view snapshot data.

6. **Modern SaaS UI**:
   - Custom Light/Dark mode with persistent preference storage.
   - Fully responsive design for Desktop, Tablet, and Mobile drawer menu.

---

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Lucide React Icons
- **Backend**: Node.js, Express.js, REST API, Mongoose, Axios, dotenv, CORS
- **Database**: MongoDB (with graceful in-memory session fallback)

---

## 📁 Project Architecture & Folder Structure

```
Ranking Checker/
├── server/
│   ├── config/
│   ├── controllers/
│   │   ├── rankingController.js
│   │   ├── historyController.js
│   │   └── analyticsController.js
│   ├── models/
│   │   └── CheckHistory.js
│   ├── routes/
│   │   └── api.js
│   ├── services/
│   │   ├── domainUtils.js
│   │   ├── rankingService.js
│   │   └── searchProviders/
│   │       ├── baseProvider.js
│   │       ├── demoProvider.js
│   │       └── serpApiProvider.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Header.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Badges.jsx
    │   │   ├── SearchForm.jsx
    │   │   ├── RankingCard.jsx
    │   │   ├── ResultsTable.jsx
    │   │   ├── LoadingState.jsx
    │   │   ├── NotFoundState.jsx
    │   │   ├── ErrorState.jsx
    │   │   └── EmptyState.jsx
    │   ├── context/
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Overview.jsx
    │   │   ├── CheckRanking.jsx
    │   │   ├── History.jsx
    │   │   └── Settings.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Environment Setup

### 1. Backend Environment Variables (`server/.env`)

Create a `server/.env` file based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rankcheck
SEARCH_PROVIDER=demo
# To use live Google Search via SerpApi:
# SEARCH_PROVIDER=serpapi
# SEARCH_API_KEY=your_actual_serpapi_key_here
# SEARCH_API_URL=https://serpapi.com/search.json
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

> **Note**: Secrets and API keys are stored strictly on the backend. Frontend code does not store or expose any API keys.

---

## 🛠️ How to Run the Application

### 1. Start the Backend Server

```bash
cd server
npm install
node server.js
```
The backend server will run on **http://localhost:5000**.

### 2. Start the Frontend Application

```bash
cd client
npm install
npm run dev
```
The Vite development server will launch at **http://localhost:5173**.

---

## 📡 API Endpoint Reference

### `POST /api/ranking/check`
- **Request Body**:
```json
{
  "businessName": "ABC Cafe",
  "websiteUrl": "https://abccafe.com",
  "location": "Delhi",
  "depth": 50
}
```
- **Response**:
```json
{
  "success": true,
  "businessName": "ABC Cafe",
  "websiteUrl": "https://abccafe.com",
  "domain": "abccafe.com",
  "searchQuery": "ABC Cafe",
  "ranking": 4,
  "found": true,
  "previousRanking": 8,
  "rankingChange": 4,
  "provider": "Demo Mode Provider (Simulated SERP)",
  "isDemo": true,
  "results": [ ... ]
}
```

### `GET /api/history`
Retrieves stored history list with optional query parameters (`search`, `status`, `page`, `limit`).

### `DELETE /api/history/:id`
Deletes a check record by ID.

### `GET /api/analytics`
Computes executive summary statistics and historical trend data based strictly on stored checks.

---

## 🔒 Security & Best Practices
- **No Secret Leakage**: All third-party API keys remain strictly in backend environment variables.
- **Sanitized Errors**: Stack traces are hidden from public API responses.
- **Input Validation**: URLs and string inputs are validated on both frontend and backend.
