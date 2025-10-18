import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import resumeRoutes from './routes/resumeRoutes.js';

const startServer = async () => {
  try {
    // 1. Load Environment Variables for local use (Render will use its own)
    dotenv.config();

    // 2. Connect to the Database
    await connectDB();

    const app = express();
    // --- FINAL CHANGE FOR RENDER ---
    // Render provides its own PORT environment variable. 10000 is a common default.
    const PORT = process.env.PORT || 10000;

    // 4. Apply Middleware
    const allowedOrigins = [
      'http://localhost:3000', // Common local dev port
      'http://localhost:5173', // Another common local dev port (Vite)
      'https://one-click-portfolio.vercel.app' // Your deployed Vercel frontend
    ];
    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (like Postman)
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    };
    app.use(cors(corsOptions));
    app.use(express.json());

    // 5. Apply All API Routes
    app.use('/api', resumeRoutes);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 6. Start Listening for requests
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();