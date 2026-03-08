import express from "express";
import {
    getProfile,
    updateProfile,
    activateRole,
    resetDonorTimer
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
    updateProfileSchema,
    activateRoleSchema
} from "../validators/user.validator.js";

const router = express.Router();

// All routes are protected
router.use(verifyToken);

// User profile routes
router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.post("/activate-role", validate(activateRoleSchema), activateRole);
router.post("/reset-timer", resetDonorTimer);

export default router;