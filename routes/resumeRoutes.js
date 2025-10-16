import express from 'express';
import multer from 'multer';
import path from 'path';
import resumeController from '../controllers/resumeController.js';

const router = express.Router();

// Use memoryStorage so the controller can access file.buffer directly.
// This avoids disk/write issues and ensures we actually received the multipart payload.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: PDF, DOC, DOCX.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// IMPORTANT: use the exact field name 'resume' to match the frontend formData.append('resume', ...)
router.post('/upload-resume', upload.single('resume'), resumeController.uploadResume);

export default router;