import mongoose from 'mongoose';

const nameSchema = new mongoose.Schema({ first: String, last: String, full: String });
const addressSchema = new mongoose.Schema({ original: String, normalized: String, city: String, state: String, country_code: String });
const workExperienceSchema = new mongoose.Schema({ companyName: String, role: String, location: String, description: String, fromDate: String, toDate: String });
const educationSchema = new mongoose.Schema({ institution: String, degree: String, description: String, fromDate: String, toDate: String });
const projectSchema = new mongoose.Schema({ project_name: String, project_description: String, project_link: String });

const resumeSchema = new mongoose.Schema({
  name: nameSchema,
  email: String,
  phone: String,
  address: addressSchema,
  currentJobRole: String,
  jobDescription: String,
  skills: [String],
  hobbies: String,
  experience: [workExperienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  createdAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;

