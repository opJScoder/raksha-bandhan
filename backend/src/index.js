import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router as giftsRouter } from './routes/gifts.js';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', giftsRouter);

// CRUCIAL FOR VERCEL: Only start the local listener if we are NOT in production
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8787;
  app.listen(port, () => {
    console.log(`Raksha Bandhan backend listening on port ${port}`);
  });
}

// MANDATORY EXPORT STATEMENT: Hand the runtime over to Vercel's serverless handler
export default app;