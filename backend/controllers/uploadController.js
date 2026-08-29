import path from 'path';
import fs from 'fs';
import { TenderModel } from '../models/tenderModel.js';
import { formatBytes, validateFileType, extractDocumentDetails, generatePreviewSnippet } from '../services/storageService.js';

export async function handleFileUpload(req, res) {
  const uploadStartTime = Date.now();
  console.log(`\n📥 [Upload Controller] Incoming upload request received.`);

  try {
    const file = req.file;

    if (!file) {
      console.warn('⚠️  [Upload Controller] No file found in request payload (expected field name "file").');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please select a PDF, DOCX, or TXT document (field name: "file").'
      });
    }

    console.log(`📄 [Upload Controller] Processing file: "${file.originalname}" | Size: ${file.size} bytes (${formatBytes(file.size)}) | MIME: ${file.mimetype}`);

    const isValid = validateFileType(file.mimetype, file.originalname);
    if (!isValid) {
      console.warn(`⚠️  [Upload Controller] Invalid file type: "${file.mimetype}" for "${file.originalname}"`);
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT document.'
      });
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const id = `tnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formattedSize = formatBytes(file.size);

    // Ensure uploads directory exists
    const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const savedFilePath = path.join(UPLOADS_DIR, `${id}${extension}`);
    fs.writeFileSync(savedFilePath, file.buffer);
    console.log(`💾 [Upload Controller] File saved to disk at: ${savedFilePath}`);

    // Extract text, page count, and semantic chunks from uploaded document buffer
    console.log(`⚙️  [Upload Controller] Extracting text & metadata via pdf-parse/mammoth...`);
    const { text: extractedText, pages: pagesCount, chunks } = await extractDocumentDetails(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    console.log(`✅ [Upload Controller] Extraction completed: ${extractedText.length} characters, ${pagesCount} pages, ${chunks.length} chunks.`);
    const previewSnippet = generatePreviewSnippet(file.buffer, file.originalname, extractedText);

    const tenderDoc = {
      id,
      name: file.originalname,
      originalName: file.originalname,
      size: file.size,
      sizeFormatted: formattedSize,
      mimeType: file.mimetype,
      extension,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      previewSnippet,
      filePath: savedFilePath,
      fileUrl: `/api/tenders/${id}/file`,
      text: extractedText,
      extractedText,
      pages: pagesCount,
      pagesCount,
      chunks,
      chunksCount: chunks ? chunks.length : 0,
      analysisStatus: 'ready',
      analyzedAt: null,
      analysisError: null,
      structuredAnalysis: null,
      // Default risk initialization
      riskScore: 0,
      riskLevel: 'pending',
      riskReport: null,
      riskDetails: {
        score: 0,
        level: 'Pending Analysis',
        factors: ['Run Tender Intelligence Extraction to evaluate risk']
      },
      extractedData: {
        tenderId: `TND-${Math.floor(1000 + Math.random() * 9000)}`,
        organization: file.originalname,
        deadline: 'Pending AI Extraction',
        budgetEstimate: 'Pending AI Extraction',
        keyRequirements: ['File uploaded and text indexed successfully']
      },
      decisionResult: {
        recommendation: 'Pending',
        confidence: 0,
        summary: `File "${file.originalname}" ingested. Ready for Tender Intelligence Extraction.`
      }
    };

    const savedDoc = await TenderModel.save(tenderDoc);
    const duration = Date.now() - uploadStartTime;
    console.log(`🎉 [Upload Controller] Successfully processed upload in ${duration}ms. Returning 200 OK.`);

    return res.status(200).json({
      success: true,
      message: 'File uploaded and text extracted successfully!',
      text: extractedText,
      pages: pagesCount,
      chunks: chunks || [],
      file: savedDoc
    });

  } catch (error) {
    console.error('❌ [Upload Controller] Error during file upload & extraction:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while uploading the file. Please try again.'
    });
  }
}
