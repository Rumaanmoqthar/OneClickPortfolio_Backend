import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import resumeRoutes from './routes/resumeRoutes.js';

// This function will be called by Vercel
const startServer = async () => {
  try {
    // 1. Connect to the Database and WAIT for it to finish
    await connectDB();
    console.log("Database connection successful for Vercel deployment.");

    // 2. Create the Express App
    const app = express();

    // 3. Apply Middleware
    // For deployment, we use the FRONTEND_ORIGIN environment variable
    const allowedOrigins = (process.env.FRONTEND_ORIGIN || '').split(',');
    console.log("Allowed CORS Origins:", allowedOrigins);
    app.use(cors({ origin: allowedOrigins }));
    app.use(express.json());

    // 4. Apply All API Routes
    app.use('/api', resumeRoutes);
    console.log("API routes applied.");

    return app; // Return the app instance

  } catch (error) {
    console.error("❌ Failed to initialize server for Vercel:", error);
  }
};

export default await startServer();