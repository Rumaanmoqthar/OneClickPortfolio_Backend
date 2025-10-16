import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads');

const ensureUploadsDir = async () => {
  try { await fs.mkdir(uploadsDir, { recursive: true }); }
  catch (e) { /* ignore */ }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received. Use field name "resume".' });
    }

    const { originalname, mimetype, buffer } = req.file;

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowed.includes(mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type. Allowed: PDF, DOC, DOCX.' });
    }

    await ensureUploadsDir();

    const id = generateId();
    const ext = path.extname(originalname) || (mimetype === 'application/pdf' ? '.pdf' : '.bin');
    const filename = `${id}${ext}`;
    const savedPath = path.join(uploadsDir, filename);

    await fs.writeFile(savedPath, buffer);

    // Return resumeId and a public URL path to the saved file (frontend will GET this URL)
    return res.json({
      resumeId: id,
      url: `/uploads/${filename}`,
      message: 'Uploaded successfully'
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('uploadResume error:', err);
    return res.status(500).json({ error: err.message || 'Server error while uploading resume.' });
  }
};

const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing id param' });

    await ensureUploadsDir();
    const files = await fs.readdir(uploadsDir);
    const match = files.find((f) => f.startsWith(id));
    if (!match) return res.status(404).json({ error: 'Resume not found' });

    // Return JSON with the public URL (do not stream binary here to avoid frontend JSON parsing errors)
    const url = `/uploads/${match}`;
    return res.json({ resumeId: id, url });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getResume error:', err);
    return res.status(500).json({ error: err.message || 'Server error while fetching resume.' });
  }
};

export default { uploadResume, getResume };