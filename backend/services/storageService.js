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

export async function extractDocumentDetails(buffer, filename, mimeType) {
  if (!buffer || buffer.length === 0) {
    return {
      text: '',
      pages: 1,
      chunks: []
    };
  }

  const ext = path.extname(filename || '').toLowerCase();
  let text = '';
  let pages = 1;
  let extractionMethod = 'text';

  try {
    if (ext === '.pdf' || mimeType === 'application/pdf') {
      if (pdfParse) {
        // Configure options for pdf-parse (max: 0 parses all pages, pagerender defaults to standard extractor)
        const pdfOptions = {
          max: 0,
          version: 'default'
        };
        const data = await pdfParse(buffer, pdfOptions);
        if (data) {
          text = (data.text || '').trim();
          pages = data.numpages || Math.max(1, Math.ceil(buffer.length / (1024 * 40)));
          extractionMethod = 'pdf-parse';
        }
      } else {
        throw new Error('pdf-parse module is not initialized');
      }
    } else if ((ext === '.docx' || ext === '.doc' || (mimeType && mimeType.includes('word'))) && mammoth) {
      const result = await mammoth.extractRawText({ buffer });
      if (result && result.value) {
        text = result.value.trim();
        pages = Math.max(1, Math.ceil(text.length / 2000));
        extractionMethod = 'mammoth';
      }
    } else {
      // Default to UTF-8 text interpretation for TXT or plain documents
      const rawText = buffer.toString('utf-8');
      text = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ').trim();
      pages = Math.max(1, Math.ceil(text.length / 2500));
      extractionMethod = 'plain-text';
    }
  } catch (err) {
    console.warn(`[PDF/Doc Parser Warning] Extraction fallback for ${filename}:`, err.message);
    
    // Check if error is due to password protection
    if (err.message && err.message.toLowerCase().includes('password')) {
      throw new Error(`The PDF file "${filename}" is password-protected. Please remove the password and re-upload.`);
    }

    // Safe fallback extraction
    const rawText = buffer.toString('utf-8');
    text = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
    pages = Math.max(1, Math.ceil(buffer.length / (1024 * 40)));
    extractionMethod = 'binary-fallback';
  }

  // Handle scanned PDFs or empty text layers
  if (!text || text.length < 20) {
    text = `[Notice: Document "${filename}" (${pages} pages) has been uploaded. Text layer is minimal or image-based. Processing visual & metadata features for procurement evaluation.]`;
  }

  // Create semantic chunks for RAG and vector indexing
  const chunks = createTextChunks(text, 800, 150);

  return {
    text,
    pages,
    chunks,
    extractionMethod
  };
}

export function createTextChunks(text, chunkSize = 800, overlap = 150) {
  if (!text || typeof text !== 'string') return [];
  
  const chunks = [];
  let startIndex = 0;
  let chunkId = 1;

  // Split into paragraphs first if possible
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  if (paragraphs.length > 0 && text.length > chunkSize) {
    let currentChunk = '';
    let currentStart = 0;

    for (const para of paragraphs) {
      const trimmedPara = para.trim();
      if ((currentChunk + ' ' + trimmedPara).length <= chunkSize) {
        currentChunk = currentChunk ? `${currentChunk}\n\n${trimmedPara}` : trimmedPara;
      } else {
        if (currentChunk) {
          chunks.push({
            id: `chunk_${chunkId++}`,
            index: chunks.length,
            content: currentChunk,
            charCount: currentChunk.length,
            startChar: currentStart,
            endChar: currentStart + currentChunk.length
          });
          currentStart += currentChunk.length;
        }
        currentChunk = trimmedPara;
      }
    }

    if (currentChunk) {
      chunks.push({
        id: `chunk_${chunkId++}`,
        index: chunks.length,
        content: currentChunk,
        charCount: currentChunk.length,
        startChar: currentStart,
        endChar: currentStart + currentChunk.length
      });
    }
  } else {
    // Standard sliding window chunking
    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      const chunkContent = text.slice(startIndex, endIndex).trim();
      
      if (chunkContent.length > 0) {
        chunks.push({
          id: `chunk_${chunkId++}`,
          index: chunks.length,
          content: chunkContent,
          charCount: chunkContent.length,
          startChar: startIndex,
          endChar: endIndex
        });
      }

      if (endIndex >= text.length) break;
      startIndex += (chunkSize - overlap);
    }
  }

  return chunks;
}

export async function extractTextFromBuffer(buffer, filename, mimeType) {
  const result = await extractDocumentDetails(buffer, filename, mimeType);
  return result.text;
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
