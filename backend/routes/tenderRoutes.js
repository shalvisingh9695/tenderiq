import { Router } from 'express';
import { getAllTenders, getTenderById, analyzeTender, analyzeTenderRisk, evaluateTenderDecision, deleteTender } from '../controllers/tenderController.js';

const router = Router();

// GET /api/tenders
router.get('/', getAllTenders);

// GET /api/tenders/:id
router.get('/:id', getTenderById);

// POST /api/tenders/:tenderId/analyze or /:id/analyze
router.post('/:tenderId/analyze', analyzeTender);
router.post('/:id/analyze', analyzeTender);

// POST /api/tenders/:tenderId/risk-analysis or /:id/risk-analysis
router.post('/:tenderId/risk-analysis', analyzeTenderRisk);
router.post('/:id/risk-analysis', analyzeTenderRisk);

// POST /api/tenders/:tenderId/decision or /:id/decision
router.post('/:tenderId/decision', evaluateTenderDecision);
router.post('/:id/decision', evaluateTenderDecision);

// DELETE /api/tenders/:id
router.delete('/:id', deleteTender);

export default router;
