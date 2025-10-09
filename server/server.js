import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import resumeRoutes from './routes/resumeRoutes.js';

const startServer = async () => {
  try {
    // 1. Load Environment Variables
    dotenv.config();
    console.log("Environment variables loaded.");

    // 2. Connect to the Database and WAIT for it to finish
    await connectDB();

    // 3. Create the Express App
    const app = express();
    const PORT = process.env.PORT || 5000; // Render uses PORT env variable

    // 4. Apply Middleware
    console.log("Applying CORS middleware...");
    app.use(cors());
    app.use(express.json());

    // 5. Apply All API Routes
    app.use('/api', resumeRoutes);
    console.log("API routes applied.");
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 6. Start Listening for requests
    app.listen(PORT, () => {
      console.log(`✅ Server is fully ready and running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();