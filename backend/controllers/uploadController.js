import path from 'path';
<<<<<<< HEAD
import fs from 'fs';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
import { TenderModel } from '../models/tenderModel.js';
import { formatBytes, validateFileType, extractTextFromBuffer, generatePreviewSnippet } from '../services/storageService.js';

export async function handleFileUpload(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please select or drop a PDF, DOCX, or TXT file.'
      });
    }

    const isValid = validateFileType(file.mimetype, file.originalname);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT document.'
      });
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const id = `tnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formattedSize = formatBytes(file.size);

<<<<<<< HEAD
    const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const savedFilePath = path.join(UPLOADS_DIR, `${id}${extension}`);
    fs.writeFileSync(savedFilePath, file.buffer);

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    // Extract text from uploaded document buffer
    const extractedText = await extractTextFromBuffer(file.buffer, file.originalname, file.mimetype);
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
<<<<<<< HEAD
      filePath: savedFilePath,
      fileUrl: `/api/tenders/${id}/file`,
=======
      filePath: file.path,
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      extractedText,
      analysisStatus: 'ready',
      analyzedAt: null,
      analysisError: null,
      structuredAnalysis: null,
      // Legacy compatibility structures
      riskScore: {
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

    return res.status(200).json({
      success: true,
      message: 'File uploaded and text extracted successfully!',
      file: savedDoc
    });

  } catch (error) {
    console.error('Error during file upload:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while uploading the file. Please try again.'
    });
  }
}
