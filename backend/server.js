const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env
dotenv.config();

const app = express();

// CORS configuration - allow multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CLIENT_ORIGIN 
      ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:5173', 'http://localhost:5174'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
// Static for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB connection (warn-only if not set)
(async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Database connection will be skipped.');
  } else {
    try {
      await connectDB(process.env.MONGO_URI);
      console.log('MongoDB connected');
    } catch (err) {
      console.warn('MongoDB connection failed (server will still start):', err.message);
    }
  }
})();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Rental Property API running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
