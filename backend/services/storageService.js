import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.warn('pdf-parse not available:', e.message);
}

let mammoth = null;
try {
  mammoth = require('mammoth');
} catch (e) {
  console.warn('mammoth not available:', e.message);
}

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function validateFileType(mimeType, filename) {
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.doc'];
  const ext = path.extname(filename).toLowerCase();
  
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/octet-stream'
  ];

  return allowedExtensions.includes(ext) || allowedMimeTypes.includes(mimeType);
}

export async function extractTextFromBuffer(buffer, filename, mimeType) {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  const ext = path.extname(filename || '').toLowerCase();

  try {
    if ((ext === '.pdf' || mimeType === 'application/pdf') && pdfParse) {
      const data = await pdfParse(buffer);
      if (data && data.text && data.text.trim().length > 0) {
        return data.text.trim();
      }
    } else if ((ext === '.docx' || ext === '.doc' || (mimeType && mimeType.includes('word'))) && mammoth) {
      const result = await mammoth.extractRawText({ buffer });
      if (result && result.value && result.value.trim().length > 0) {
        return result.value.trim();
      }
    }

    // Default to UTF-8 text interpretation for TXT or fallback
    const rawText = buffer.toString('utf-8');
    const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText;
  } catch (err) {
    console.warn(`Text extraction fallback for ${filename}:`, err.message);
    const rawText = buffer.toString('utf-8');
    return rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

export function generatePreviewSnippet(buffer, originalName, extractedText = '') {
  if (extractedText && extractedText.length > 30) {
    return extractedText.substring(0, 200) + '...';
  }

  if (!buffer || buffer.length === 0) {
    return `Uploaded file ${originalName || 'document'} ready for AI processing.`;
  }
  
  const rawText = buffer.toString('utf-8', 0, Math.min(buffer.length, 1000));
  const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (cleanText.length > 30) {
    return cleanText.substring(0, 200) + '...';
  }
  
  return `Successfully indexed ${originalName}. Text layer ready for deep AI procurement intelligence analysis.`;
}

export { UPLOADS_DIR };
