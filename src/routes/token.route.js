import express from "express"
import { authenticateJWT } from "../middlewares/auth.middleware.js"
import TokenController from "../controllers/token.controller.js"

const router = express.Router()

const tokenRoute = new TokenController ()

router.post("/",tokenRoute.createToken);

export default router;