import { Router } from 'express';
import multer from 'multer';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = Router();

// Use memory storage for clean cross-environment buffer handling
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max file size limit
  }
});

// POST /api/upload
router.post('/upload', upload.single('file'), handleFileUpload);

export default router;
