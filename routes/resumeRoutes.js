import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToParseur, receiveParseurWebhook, getResumeById, generatePortfolioZip } from '../controllers/resumeController.js';

const router = express.Router();

// Use memoryStorage to make the file buffer available on req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-resume', upload.single('resume'), uploadToParseur);
router.post('/parseur-webhook', receiveParseurWebhook);
router.get('/resume/:id', getResumeById);
router.get('/portfolio/:id/download', generatePortfolioZip);

export default router;
