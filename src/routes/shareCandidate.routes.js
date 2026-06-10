import express from 'express';
import ShareCandidateController from '../controllers/shareCandidate.controller.js';

import { authorize } from '../middlewares/role.middleware.js';

import { authenticateJWT } from '../middlewares/auth.middleware.js';
// import { createShare, getSharedCandidates } from '../controllers/shareCandidate.controller.js';

const router = express.Router();
// router.get('/:shareId', ShareCandidateController.shareShareCandidate);
const shareCandidateController = new ShareCandidateController();

router.get('/', shareCandidateController.getAllGroups);

router.post('/', authenticateJWT,authorize('admin'), shareCandidateController.createShareCandidate);

// for group name update

router.put('/:id', authenticateJWT,authorize('admin'), shareCandidateController.updateGroup);
// for group delete

router.delete('/:id', authenticateJWT, authorize('admin'), shareCandidateController.deleteGroup);

router.get('/:id', shareCandidateController.getSingleGroup); // This route is for fetching shared candidate details based on the groupId.

// remove user from group

router.delete('/:groupId/user/:userId', authenticateJWT, authorize('admin'), shareCandidateController.removeUserFromGroup);

// add user to group
router.put('/:groupId/user/:userId', authenticateJWT, authorize('admin'), shareCandidateController.addUserToGroup);

// share candidate details
router.get("/share/:shareId", shareCandidateController.shareShareCandidate); // This route is for fetching shared candidate details based on the shareId.

export default router;
