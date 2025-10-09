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
    const PORT = process.env.PORT || 5000;

    // 4. Apply Middleware
    console.log("Applying simple CORS middleware for local development...");
    app.use(cors());
    app.use(express.json());

    // 5. Apply All API Routes from your router file
    app.use('/api', resumeRoutes);
    console.log("API routes applied.");

    // New simple test route at /api/product
    app.get('/api/product', (req, res) => {
      res.json({ status: 'OK', message: 'Product test route is working' });
    });

    // 6. Start Listening for requests
    app.listen(PORT, () => {
      console.log(`✅ Server is fully ready and running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();