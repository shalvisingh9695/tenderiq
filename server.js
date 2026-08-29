import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import connectDB from './backend/config/db.js';
import uploadRoutes from './backend/routes/uploadRoutes.js';
import tenderRoutes from './backend/routes/tenderRoutes.js';
import { askQuestion } from './backend/controllers/tenderController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize MongoDB Atlas connection
  await connectDB();

  // Enable robust CORS configuration for standalone Vercel / Render deployments
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow all origins (standard for public/mobile/cloud client frontends)
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: false
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // Body parser middleware with safe payload limits
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Clean Request Logging Middleware
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const color = status >= 400 ? '❌' : '✅';
        console.log(`${color} [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${status} (${duration}ms)`);
      });
    }
    next();
  });

  // Health check endpoints
  const healthHandler = (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'TenderIQ Production Engine',
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  };

  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  // Mount API routes
  app.use('/api', uploadRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/tenders', tenderRoutes);
  app.post('/api/ask', askQuestion);
  app.post('/api/chat', askQuestion);

  // Fallback for unhandled /api/* routes - ALWAYS return JSON, NEVER HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API route ${req.method} ${req.originalUrl} not found.`
    });
  });

  // Centralized JSON Error Handler for all /api routes
  app.use('/api', (err, req, res, next) => {
    console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err);
    res.status(err.status || err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 for containerized / Cloud platforms (Render, Cloud Run, Heroku)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TenderIQ server listening on 0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start TenderIQ server:', err);
  process.exit(1);
});
