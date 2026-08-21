import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import galleryRouter from './routes/gallery.js';
import contactRouter from './routes/contact.js';
import profileRouter from './routes/profile.js';
import skillsRouter from './routes/skills.js';
import experiencesRouter from './routes/experiences.js';
import educationRouter from './routes/education.js';
import servicesRouter from './routes/services.js';
import socialsRouter from './routes/socials.js';
import faqsRouter from './routes/faqs.js';
import navRouter from './routes/nav.js';

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or if allowed origin matches
    if (!origin || ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
      callback(null, true);
    } else {
      // In production, allow all origins if ALLOWED_ORIGINS is not explicitly restricting
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/projects', projectsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/contact', contactRouter);
app.use('/api/profile', profileRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/education', educationRouter);
app.use('/api/services', servicesRouter);
app.use('/api/socials', socialsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/nav', navRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
