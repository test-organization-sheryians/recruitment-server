import express from "express";
import passport from "passport";
import AuthController from "../controllers/googleAuth.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/failed",
  }),
  AuthController.googleAuthCallback
);

router.get("/failed", AuthController.authFailed);

router.get("/me", isAuthenticated, AuthController.getMe);

export default router;