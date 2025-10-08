import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import archiver from 'archiver';
import https from 'https';
// --- THIS IS THE FIX ---
// We now correctly import the required constants using ES Module syntax.
import { constants } from 'crypto';
import Resume from '../models/resumeModel.js';
import { getClassicPortfolioHTML } from '../templates/classicTemplate.js';
import { getModernPortfolioHTML } from '../templates/modernTemplate.js';

// Create a custom HTTPS agent with the corrected syntax to ensure compatibility.
const httpsAgent = new https.Agent({
  secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

/**
 * Handles the resume upload, including template choice.
 */
export const uploadToParseur = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const template = req.body.template || 'modern';
  const filePath = req.file.path;
  let newResume;

  try {
    newResume = new Resume({ name: { full: 'Processing...' } });
    await newResume.save();
    console.log(`Checkpoint 1: Created placeholder with internal ID: ${newResume._id}`);

    const mailboxId = '141196';
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('InternalResumeId', newResume._id.toString());

    const formHeaders = form.getHeaders();
    await axios.post(`https://api.parseur.com/parser/${mailboxId}/upload`, form, {
      headers: {
        ...formHeaders,
        'Authorization': `Token ${process.env.PARSEUR_API_KEY}`,
      },
      httpsAgent // Apply the SSL compatibility fix
    });

    console.log(`Checkpoint 2: Sent file to Parseur, tagged with our InternalResumeId: ${newResume._id}`);

    res.status(200).json({
      message: 'Your portfolio is being generated!',
      resumeId: newResume._id,
    });

  } catch (apiError) {
    const errorMessage = apiError.response ? JSON.stringify(apiError.response.data) : apiError.message;
    console.error('---!!! UPLOAD ERROR !!!---', errorMessage);
    if (newResume?._id) await Resume.findByIdAndDelete(newResume._id);
    res.status(500).json({ error: 'Error during the upload process. Check server logs.' });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

/**
 * Handles the incoming webhook from Parseur.
 */
export const receiveParseurWebhook = async (req, res) => {
  console.log('---!!! WEBHOOK RECEIVED !!!---');
  const parsedData = req.body;
  const internalResumeId = parsedData.internal_resume_id;

  if (!internalResumeId) {
    console.error('Webhook Error: No "internal_resume_id" field found in payload.');
    return res.status(400).send('Bad Request: Missing the required ID field.');
  }

  try {
    const updatedData = {
      name: parsedData.CandidateName,
      email: parsedData.CandidateEmail,
      phone: parsedData.CandidatePhone,
      address: parsedData.CandidateAddress,
      currentJobRole: parsedData.CurrentJobRole,
      jobDescription: parsedData.CurentJobDescription,
      skills: parsedData.Skills ? parsedData.Skills.split(/, |\n| \/ /g).map(s => s.trim()).filter(Boolean) : [],
      hobbies: parsedData.OtherInterestsHobbies,
      experience: parsedData.WorkExperience,
      education: parsedData.Education,
      projects: parsedData.Projects || [],
    };

    const updatedResume = await Resume.findByIdAndUpdate(internalResumeId, updatedData, { new: true });

    if (!updatedResume) {
      return res.status(404).send('Matching resume placeholder not found.');
    }

    console.log(`Webhook data successfully saved to MongoDB for internal ID: ${updatedResume._id}.`);
    res.status(200).send('OK');

  } catch (dbError) {
    console.error('---!!! DATABASE SAVE ERROR FROM WEBHOOK !!!---', dbError.message);
    res.status(500).send('Error saving data.');
  }
};

/**
 * Fetches a resume by its ID.
 */
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Portfolio not found.' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching portfolio.' });
  }
};

/**
 * Generates and downloads the portfolio code as a ZIP file.
 */
export const generatePortfolioZip = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    const templateType = req.query.template || 'modern';

    if (!resume || resume.name.full === 'Processing...') {
      return res.status(404).json({ message: 'Portfolio data not ready.' });
    }

    const zipFileName = `${resume.name.full.replace(/\s+/g, '_')}_Portfolio.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    const portfolioHtml = templateType === 'classic'
      ? getClassicPortfolioHTML(resume.toObject())
      : getModernPortfolioHTML(resume.toObject());

    archive.append(portfolioHtml, { name: 'index.html' });

    const readmeContent = `# ${resume.name.full}'s Portfolio\n\nThis portfolio was generated by OneClick Portfolio.`;
    archive.append(readmeContent, { name: 'README.md' });

    await archive.finalize();

  } catch (error) {
    console.error('Error generating portfolio ZIP:', error);
    res.status(500).send({ message: 'Server error while generating ZIP.' });
  }
};

