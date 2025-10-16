import fs from 'fs/promises';
import path from 'path';
import { createReadStream, existsSync } from 'fs';

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

    // Replace this with your processing call if you have one:
    // const processed = await processResume(savedPath, { template: req.body.template });

    return res.json({
      resumeId: id,
      savedPath: `/uploads/${filename}`,
      message: 'Uploaded successfully'
    });
  } catch (err) {
    console.error('uploadResume error:', err);
    return res.status(500).json({ error: err.message || 'Server error while uploading resume.' });
  }
};

const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing id param' });

    // find file in uploadsDir that starts with the id
    await ensureUploadsDir();
    const files = await fs.readdir(uploadsDir);
    const match = files.find((f) => f.startsWith(id));
    if (!match) return res.status(404).json({ error: 'Resume not found' });

    const filePath = path.join(uploadsDir, match);

    // If you want to return JSON with URL:
    // return res.json({ resumeId: id, url: `/uploads/${match}` });

    // Or send file directly:
    if (!existsSync(filePath)) return res.status(404).json({ error: 'File missing' });

    // set proper content-type based on extension
    const ext = path.extname(match).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' :
                        ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                        ext === '.doc' ? 'application/msword' : 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // stream file
    const stream = createReadStream(filePath);
    stream.on('error', (err) => {
      console.error('stream error', err);
      res.status(500).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error('getResume error:', err);
    return res.status(500).json({ error: err.message || 'Server error while fetching resume.' });
  }
};

export default { uploadResume, getResume };