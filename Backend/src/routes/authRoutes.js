import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";

const router = Router();

// Registration Route
router.post("/register", register);

// Login Route
router.post("/login", passport.authenticate("local"), login);

// Auth Status Route
router.get("/Status", authStatus);

// Logout Route
router.post("/logout", logout);

// 2FA Setup Route
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized User" });
  },
  setup2FA
);

// Verify Route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized User" });
  },
  verify2FA
);

// reset Route
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized User" });
  },
  reset2FA
);

export default router;
