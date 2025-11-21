import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as linksCtrl from './controllers/links';
import * as redirectCtrl from './controllers/redirect';

// In production (Vercel), environment variables are provided by the platform
// In development, load from .env file
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (err) {
    // dotenv not available, that's okay in production
  }
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, version: '1.0', uptime: process.uptime() });
});

app.post('/api/links', linksCtrl.createLink);
app.get('/api/links', linksCtrl.listLinks);
app.get('/api/links/:code', linksCtrl.getLinkStats);
app.delete('/api/links/:code', linksCtrl.deleteLink);

app.get('/:code', redirectCtrl.redirectHandler);

export default app;
