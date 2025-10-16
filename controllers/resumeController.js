import fs from 'fs/promises';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

const ensureUploadsDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    // ignore, will fail later if not writable
  }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const uploadResume = async (req, res) => {
  try {
    // multer.memoryStorage -> req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No file received. Make sure you upload under the field name "resume".' });
    }

    const { originalname, mimetype, buffer } = req.file;

    // Basic validation (already done by fileFilter, but double-check)
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowed.includes(mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type. Allowed: PDF, DOC, DOCX.' });
    }

    await ensureUploadsDir();

    // Save the upload (so you can inspect the file in Render logs or for downstream processing)
    const id = generateId();
    const ext = path.extname(originalname) || (mimetype === 'application/pdf' ? '.pdf' : '.bin');
    const filename = `${id}${ext}`;
    const savedPath = path.join(uploadsDir, filename);

    await fs.writeFile(savedPath, buffer);

    // TODO: call your existing resume processing logic here.
    // Example:
    // const portfolioId = await processResumeFile(savedPath, { template: req.body.template });

    // For now, return success and an ID so frontend can navigate.
    return res.json({
      resumeId: id,
      savedPath: `/uploads/${filename}`,
      message: 'File uploaded. Resume processing should be handled asynchronously.',
    });
  } catch (err) {
    // Log server-side for debugging (Render logs)
    // eslint-disable-next-line no-console
    console.error('uploadResume error:', err);
    return res.status(500).json({ error: err.message || 'Server error while uploading resume.' });
  }
};

export default { uploadResume };