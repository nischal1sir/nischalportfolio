import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects.js';
import galleryRouter from './routes/gallery.js';
import contactRouter from './routes/contact.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/projects', projectsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/contact', contactRouter);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
