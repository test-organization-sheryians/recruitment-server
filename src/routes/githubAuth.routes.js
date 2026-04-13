import express from "express";
import passport from "passport";
import GitHubAuthController from "../controllers/githubAuth.controller.js";

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/github/failed",
  }),
  GitHubAuthController.githubAuthCallback
);

router.get("/github/failed", GitHubAuthController.authFailed);

export default router;