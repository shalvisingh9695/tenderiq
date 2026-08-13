import { TenderModel } from '../models/tenderModel.js';
import { TenderAnalysisService } from '../services/tenderAnalysisService.js';
import { RiskIntelligenceService } from '../services/riskIntelligenceService.js';
import { DecisionEngineService } from '../services/decisionEngineService.js';

export async function getAllTenders(req, res) {
  try {
    const tenders = await TenderModel.findAll();
    return res.status(200).json({
      success: true,
      count: tenders.length,
      data: tenders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve tenders.'
    });
  }
}

export async function getTenderById(req, res) {
  try {
    const { id } = req.params;
    const tender = await TenderModel.findById(id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: 'Tender document not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: tender
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching tender details.'
    });
  }
}

export async function analyzeTender(req, res) {
  try {
    const { id, tenderId } = req.params;
    const targetId = id || tenderId;
    const tender = await TenderModel.findById(targetId);

    if (!tender) {
      return res.status(404).json({
        success: false,
        status: 'failed',
        error: `Tender document with ID '${targetId}' was not found.`
      });
    }

    if (!tender.extractedText || tender.extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        status: 'failed',
        error: 'Tender document does not contain readable text content to analyze.'
      });
    }

    // Set status to analyzing
    await TenderModel.update(targetId, {
      status: 'analyzing',
      analysisStatus: 'analyzing',
      analysisError: null
    });

    try {
      const structuredAnalysis = await TenderAnalysisService.analyzeTenderText(
        tender.extractedText,
        {
          name: tender.name || tender.originalName,
          extension: tender.extension
        }
      );

      // Extract deadline text carefully
      const subDeadlineObj = structuredAnalysis.importantDates.find(
        (d) => d.type === 'submissionDeadline' || d.label?.toLowerCase().includes('submission') || d.label?.toLowerCase().includes('deadline')
      );
      const deadlineDisplay = subDeadlineObj ? subDeadlineObj.originalText : 'Specified in tender';

      // Update tender document with validated structured analysis and updated status
      const updatedTender = await TenderModel.update(targetId, {
        structuredAnalysis,
        status: 'analyzed',
        analysisStatus: 'analyzed',
        analyzedAt: new Date().toISOString(),
        analysisError: null,
        extractedData: {
          tenderId: structuredAnalysis?.basicInformation?.referenceId || tender.extractedData?.tenderId || `TND-${targetId}`,
          organization: structuredAnalysis?.basicInformation?.procuringAuthority || tender.extractedData?.organization || 'Authority',
          deadline: deadlineDisplay,
          budgetEstimate: structuredAnalysis?.basicInformation?.estimatedValue ? `${structuredAnalysis.basicInformation.estimatedValue} ${structuredAnalysis.basicInformation.currency || ''}`.trim() : 'Under Evaluation',
          keyRequirements: (structuredAnalysis.mandatoryDocuments || []).map(d => `${d.documentName} (${d.category})`)
        }
      });

      // API Response matching Requirement 11
      return res.status(200).json({
        success: true,
        tenderId: targetId,
        status: 'analyzed',
        analysis: structuredAnalysis,
        data: updatedTender
      });

    } catch (analysisErr) {
      console.error('Tender Analysis execution failed:', analysisErr);
      const cleanMessage = analysisErr.message
        ? analysisErr.message.replace(/key=[^&]+/gi, 'key=HIDDEN')
        : 'AI extraction failed.';

      await TenderModel.update(targetId, {
        status: 'failed',
        analysisStatus: 'failed',
        analysisError: cleanMessage
      });

      return res.status(500).json({
        success: false,
        status: 'failed',
        error: cleanMessage
      });
    }

  } catch (error) {
    console.error('Error in analyzeTender controller:', error);
    const cleanMessage = error.message
      ? error.message.replace(/key=[^&]+/gi, 'key=HIDDEN')
      : 'Server error while executing tender analysis.';

    return res.status(500).json({
      success: false,
      status: 'failed',
      error: cleanMessage
    });
  }
}

export async function analyzeTenderRisk(req, res) {
  try {
    const { id, tenderId } = req.params;
    const targetId = id || tenderId;
    const tender = await TenderModel.findById(targetId);

    if (!tender) {
      return res.status(404).json({
        success: false,
        riskStatus: 'failed',
        error: `Tender document with ID '${targetId}' was not found.`
      });
    }

    if (!tender.structuredAnalysis) {
      return res.status(400).json({
        success: false,
        riskStatus: 'failed',
        error: 'Tender analysis has not been performed yet. Please analyze the tender document first before generating Risk Intelligence.'
      });
    }

    // Set risk status to analyzing
    await TenderModel.update(targetId, {
      riskStatus: 'analyzing',
      riskError: null
    });

    try {
      const riskReport = await RiskIntelligenceService.analyzeRisk({
        tenderId: targetId,
        structuredAnalysis: tender.structuredAnalysis,
        documentText: tender.extractedText || ''
      });

      const updatedTender = await TenderModel.update(targetId, {
        riskStatus: 'completed',
        riskReport,
        riskAnalyzedAt: new Date().toISOString(),
        riskError: null
      });

      return res.status(200).json({
        success: true,
        tenderId: targetId,
        riskStatus: 'completed',
        riskReport,
        data: updatedTender
      });

    } catch (riskErr) {
      console.error('Risk Analysis execution failed:', riskErr);
      const cleanMessage = riskErr.message
        ? riskErr.message.replace(/key=[^&]+/gi, 'key=HIDDEN')
        : 'Risk calculation failed.';

      await TenderModel.update(targetId, {
        riskStatus: 'failed',
        riskError: cleanMessage
      });

      return res.status(500).json({
        success: false,
        riskStatus: 'failed',
        error: cleanMessage
      });
    }

  } catch (error) {
    console.error('Error in analyzeTenderRisk controller:', error);
    const cleanMessage = error.message
      ? error.message.replace(/key=[^&]+/gi, 'key=HIDDEN')
      : 'Server error while running risk intelligence engine.';

    return res.status(500).json({
      success: false,
      riskStatus: 'failed',
      error: cleanMessage
    });
  }
}

export async function evaluateTenderDecision(req, res) {
  try {
    const targetId = req.params.tenderId || req.params.id;
    if (!targetId) {
      return res.status(400).json({
        success: false,
        error: 'Tender ID is required.'
      });
    }

    // 1. Validate tender exists
    const tender = await TenderModel.findById(targetId);
    if (!tender) {
      return res.status(404).json({
        success: false,
        error: `Tender document with ID '${targetId}' was not found.`
      });
    }

    // 2. Validate analysis exists
    if (!tender.structuredAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'Tender analysis is missing. Please analyze the tender document first before running decision evaluation.'
      });
    }

    // 3. Validate risk report exists
    if (!tender.riskReport) {
      return res.status(400).json({
        success: false,
        error: 'Risk report is missing. Please run risk intelligence analysis first before running decision evaluation.'
      });
    }

    // 4. Accept company profile from request body & validate
    const companyProfile = req.body?.companyProfile || (req.body && Object.keys(req.body).length > 0 ? req.body : null);
    if (!companyProfile || typeof companyProfile !== 'object' || Object.keys(companyProfile).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Company profile data is required.'
      });
    }

    // 5. Run decision engine
    const decisionReport = await DecisionEngineService.evaluateDecision({
      tenderId: targetId,
      companyProfile,
      structuredAnalysis: tender.structuredAnalysis,
      riskReport: tender.riskReport
    });

    await TenderModel.update(targetId, {
      decisionStatus: 'completed',
      decisionEvaluatedAt: new Date().toISOString(),
      decisionReport,
      companyProfileSnapshot: companyProfile
    });

    // 6. Return result
    return res.status(200).json(decisionReport);

  } catch (error) {
    console.error('Error in evaluateTenderDecision controller:', error);
    const cleanMessage = error.message
      ? error.message.replace(/key=[^&]+/gi, 'key=HIDDEN')
      : 'Server error while evaluating decision.';

    return res.status(500).json({
      success: false,
      error: cleanMessage
    });
  }
}

export async function deleteTender(req, res) {
  try {
    const { id } = req.params;
    const deleted = await TenderModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Tender document not found or already deleted.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tender document deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error deleting tender document.'
    });
  }
}
