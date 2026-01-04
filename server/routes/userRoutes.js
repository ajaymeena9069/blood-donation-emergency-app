import express from "express";
import { activateRole, loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/activate-role', activateRole);
export default router;