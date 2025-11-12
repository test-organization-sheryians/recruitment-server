import express from 'express'
import uploadResume from '../middlewares/uploadResume'
import { authorize } from '../middlewares/role.middleware'
import { authenticateJWT } from '../middlewares/auth.middleware'



const router = express.Router;

router.post(
    '/apply/:jobId',
    authenticateJWT,
    authorize,
    uploadResume.single('resume'),
    //constoller(jobapllciationController)
)

export default router;
