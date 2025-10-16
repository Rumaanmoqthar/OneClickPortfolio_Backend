import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();

// Allow JSON bodies for non-multipart endpoints
app.use(express.json());

// Configure CORS: allow your deployed frontend origin and localhost during development
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://oneclickportfolio.onrender.com',
  process.env.VITE_DEV_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true,
}));

// Serve uploads folder (optional)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API routes
app.use('/api', resumeRoutes);

// Health-check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server running on port ${PORT}`);
  /* eslint-enable no-console */
});