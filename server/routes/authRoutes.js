// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authRateLimiter, validate(registerSchema), registerUser);
router.post("/login", authRateLimiter, validate(loginSchema), loginUser);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;