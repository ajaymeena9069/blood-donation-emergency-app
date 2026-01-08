import express from "express";
import {
    getProfile,
    updateProfile,
    activateRole
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
    updateProfileSchema,
    activateRoleSchema
} from "../../common/validators/user.validator.js";

const router = express.Router();
router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.post("/activate-role", validate(activateRoleSchema), activateRole);

export default router;