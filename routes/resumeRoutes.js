import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToParseur, receiveParseurWebhook, getResumeById, generatePortfolioZip } from '../controllers/resumeController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'server', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  }, // <-- The stray 'a' has been removed from here
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

router.post('/upload-resume', upload.single('resume'), uploadToParseur);
router.post('/parseur-webhook', receiveParseurWebhook);
router.get('/resume/:id', getResumeById);
router.get('/portfolio/:id/download', generatePortfolioZip);

export default router;

