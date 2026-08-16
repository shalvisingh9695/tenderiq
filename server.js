import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import uploadRoutes from "./backend/routes/uploadRoutes.js";
import tenderRoutes from "./backend/routes/tenderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TenderIQ Backend",
    timestamp: new Date().toISOString()
  });
});

// routes
app.use("/api", uploadRoutes);
app.use("/api/tenders", tenderRoutes);

// error fallback
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API not found"
  });
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});