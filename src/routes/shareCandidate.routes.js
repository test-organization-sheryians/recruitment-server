import express from 'express';
import ShareCandidateController from '../controllers/shareCandidate.controller.js';
// import { createShare, getSharedCandidates } from '../controllers/shareCandidate.controller.js';

const router = express.Router();

// router.post('/', ShareCandidateController.createShareCandidate);

// router.get('/test', (req, res) => {
//   res.send('share route working');
// });

// router.get('/:shareId', ShareCandidateController.shareShareCandidate);
const shareCandidateController = new ShareCandidateController();

router.post('/', shareCandidateController.createShareCandidate);
router.get('/:shareId', shareCandidateController.shareShareCandidate);

export default router;
