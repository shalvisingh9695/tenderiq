import express from 'express';

import uploadRoutes from './backend/routes/uploadRoutes.js';
import tenderRoutes from './backend/routes/tenderRoutes.js';

const app = express();
const PORT = process.env.PORT || 10000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TenderIQ Backend Engine',
    timestamp: new Date().toISOString()
  });
});

// routes
app.use('/api', uploadRoutes);
app.use('/api/tenders', tenderRoutes);

// simple root route (IMPORTANT)
app.get('/', (req, res) => {
  res.send('TenderIQ Backend Running 🚀');
});

// start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Server running on port ${PORT}`);
});