import { Router } from "express";
import passport from "passport";
import { getUser, loginSuccess, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true,
  }),
  loginSuccess
);

router.get("/me", getUser);

router.get("/logout", logout);

export default router;
