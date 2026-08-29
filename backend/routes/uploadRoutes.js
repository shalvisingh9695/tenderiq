import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = Router();

// Configure memory storage
const storage = multer.memoryStorage();

// Allowed file extensions and MIME types
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.doc', '.txt']);
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'application/octet-stream' // fallback
]);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Unsupported file extension '${ext}'. Allowed types: PDF, DOCX, TXT.`), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB
    files: 1
  }
});

// Custom upload middleware wrapper with clean error response handling
const handleUploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          error: 'File size exceeds maximum allowed limit of 30MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: `File upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Invalid file format uploaded.'
      });
    }
    next();
  });
};

// Route handlers for /api/upload and /upload
router.post('/upload', handleUploadMiddleware, handleFileUpload);
router.post('/', handleUploadMiddleware, handleFileUpload);

export default router;
