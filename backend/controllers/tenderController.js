import path from "path";
import fs from "fs";

import { TenderModel } from "../models/tenderModel.js";
import { TenderAnalysisService } from "../services/tenderAnalysisService.js";
import { RiskIntelligenceService } from "../services/riskIntelligenceService.js";
import { DecisionEngineService } from "../services/decisionEngineService.js";
import { ChatService } from "../services/chatService.js";

/* =========================
   GET ALL TENDERS
========================= */
export async function getAllTenders(req, res) {
  try {
    const tenders = await TenderModel.findAll();

    return res.status(200).json({
      success: true,
      count: tenders.length,
      data: tenders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve tenders.",
    });
  }
}

/* =========================
   GET TENDER BY ID
========================= */
export async function getTenderById(req, res) {
  try {
    const id = req.params.id;
    const tender = await TenderModel.findById(id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: "Tender document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tender,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Error fetching tender details.",
    });
  }
}

/* =========================
   ANALYZE TENDER
========================= */
export async function analyzeTender(req, res) {
  try {
    const targetId = req.params.id || req.params.tenderId;

    const tender = await TenderModel.findById(targetId);

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: "Tender not found",
      });
    }

    if (!tender.extractedText) {
      return res.status(400).json({
        success: false,
        error: "No text found in document",
      });
    }

    await TenderModel.update(targetId, {
      status: "analyzing",
    });

    const structuredAnalysis =
      await TenderAnalysisService.analyzeTenderText(
        tender.extractedText,
        {
          name: tender.name,
          extension: tender.extension,
        }
      );

    let riskReport = null;

    try {
      riskReport = await RiskIntelligenceService.analyzeRisk({
        tenderId: targetId,
        structuredAnalysis,
        documentText: tender.extractedText,
      });
    } catch (e) {
      console.warn("Risk generation failed:", e.message);
    }

    const updated = await TenderModel.update(targetId, {
      structuredAnalysis,
      riskReport,
      status: "analyzed",
      analyzedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/* =========================
   RISK ANALYSIS
========================= */
export async function analyzeTenderRisk(req, res) {
  try {
    const id = req.params.id;
    const tender = await TenderModel.findById(id);

    if (!tender?.structuredAnalysis) {
      return res.status(400).json({
        success: false,
        error: "Analyze tender first",
      });
    }

    const riskReport = await RiskIntelligenceService.analyzeRisk({
      tenderId: id,
      structuredAnalysis: tender.structuredAnalysis,
      documentText: tender.extractedText,
    });

    await TenderModel.update(id, {
      riskReport,
      riskStatus: "completed",
    });

    return res.json({
      success: true,
      riskReport,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/* =========================
   DECISION ENGINE
========================= */
export async function evaluateTenderDecision(req, res) {
  try {
    const id = req.params.id;

    const tender = await TenderModel.findById(id);

    if (!tender?.structuredAnalysis) {
      return res.status(400).json({
        success: false,
        error: "Analyze tender first",
      });
    }

    if (!tender.riskReport) {
      return res.status(400).json({
        success: false,
        error: "Run risk analysis first",
      });
    }

    const companyProfile = req.body;

    const decisionReport =
      await DecisionEngineService.evaluateDecision({
        tenderId: id,
        companyProfile,
        structuredAnalysis: tender.structuredAnalysis,
        riskReport: tender.riskReport,
      });

    await TenderModel.update(id, {
      decisionReport,
      decisionStatus: "completed",
      companyProfileSnapshot: companyProfile,
    });

    return res.json({
      success: true,
      ...decisionReport,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/* =========================
   DELETE TENDER
========================= */
export async function deleteTender(req, res) {
  try {
    const id = req.params.id;

    const deleted = await TenderModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }

    return res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/* =========================
   CHAT WITH TENDER
========================= */
export async function chatWithTender(req, res) {
  try {
    const id = req.params.id;
    const question = req.body.question;

    const tender = await TenderModel.findById(id);

    if (!tender?.extractedText) {
      return res.status(400).json({
        success: false,
        error: "No document text",
      });
    }

    const result = await ChatService.answerQuestion({
      question,
      documentText: tender.extractedText,
    });

    return res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/* =========================
   SERVE FILE
========================= */
export async function serveTenderFile(req, res) {
  try {
    const id = req.params.id;
    const tender = await TenderModel.findById(id);

    if (!tender?.filePath) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    if (fs.existsSync(tender.filePath)) {
      return fs.createReadStream(tender.filePath).pipe(res);
    }

    return res.status(404).json({
      success: false,
      error: "File missing on server",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}