// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;