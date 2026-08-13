import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import uploadRoutes from './backend/routes/uploadRoutes.js';
import tenderRoutes from './backend/routes/tenderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TenderIQ Backend Engine',
      phase: 'Phase 1 - AI Foundation & Upload Pipeline',
      timestamp: new Date().toISOString()
    });
  });

  // Mount MVC API routes
  app.use('/api', uploadRoutes);
  app.use('/api/tenders', tenderRoutes);

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.get("/", (req, res) => {
  res.send("TenderIQ Backend Running 🚀");
});
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ TenderIQ Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
