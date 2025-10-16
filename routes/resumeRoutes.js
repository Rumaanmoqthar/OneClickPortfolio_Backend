import express from 'express';
import multer from 'multer';
import resumeController from '../controllers/resumeController.js';

const router = express.Router();

// memoryStorage so controller gets req.file.buffer
const storage = multer.memoryStorage();

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type. Allowed: PDF, DOC, DOCX.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/upload-resume  (expects field name "resume")
router.post('/upload-resume', upload.single('resume'), resumeController.uploadResume);

// GET  /api/resume/:id  (returns saved file URL or sends file)
router.get('/resume/:id', resumeController.getResume);

export default router;