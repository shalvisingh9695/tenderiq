import { Router } from 'express';
<<<<<<< HEAD
import { getAllTenders, getTenderById, analyzeTender, analyzeTenderRisk, evaluateTenderDecision, deleteTender, chatWithTender, serveTenderFile } from '../controllers/tenderController.js';
=======
import { getAllTenders, getTenderById, analyzeTender, analyzeTenderRisk, evaluateTenderDecision, deleteTender } from '../controllers/tenderController.js';
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

const router = Router();

// GET /api/tenders
router.get('/', getAllTenders);

<<<<<<< HEAD
// GET /api/tenders/:id/file
router.get('/:id/file', serveTenderFile);

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
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

<<<<<<< HEAD
// POST /api/tenders/:tenderId/chat or /:id/chat
router.post('/:tenderId/chat', chatWithTender);
router.post('/:id/chat', chatWithTender);

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
// DELETE /api/tenders/:id
router.delete('/:id', deleteTender);

export default router;
