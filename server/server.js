const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || (process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173'),
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection state tracking
let dbConnected = false;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_connection_string') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB successfully.');
      dbConnected = true;
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection error:', err.message);
      console.warn('⚡ Operating in DB-Fallback mode (In-Memory temporary session storage active).');
    });
} else {
  console.log('⚡ MONGODB_URI not provided or placeholder used. Operating in DB-Fallback mode (In-Memory session active).');
}

// Inject DB connection flag into requests
app.use((req, res, next) => {
  req.dbConnected = dbConnected;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    dbConnected,
    searchProvider: process.env.SEARCH_PROVIDER || 'serpapi'
  });
});

// Register API Routes
app.use('/api', apiRoutes);

// Serve Frontend Static Files in Production (Render All-in-One Deployment)
const path = require('path');
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    }
    next();
  });
}

// Global Error Handler (Sanitizes stack traces & protects sensitive backend information)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred.'
      : err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 RankCheck API Server listening on port ${PORT}`);
  console.log(`📡 Search Provider: ${process.env.SEARCH_PROVIDER || 'serpapi (Google / SerpApi Provider)'}`);
});
