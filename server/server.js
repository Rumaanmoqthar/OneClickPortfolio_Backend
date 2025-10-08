import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// --- Database Connection Logic (adapted from your example) ---
let isConnected = false;

const connectToMongoDB = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('=> new database connection established');
  } catch (error) {
    console.error('=> error connecting to MongoDB:', error);
  }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectToMongoDB();
  next();
});
// ----------------------------------------------------------------

// Main API Routes
app.use('/api', resumeRoutes);

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export the app for Vercel serverless functions
export default app;