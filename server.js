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
    const allowedOrigins = (process.env.FRONTEND_ORIGIN || '').split(',');
    app.use(cors({ origin: allowedOrigins }));
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