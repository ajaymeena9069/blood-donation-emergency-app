import express from "express";
import { registerPatient, loginPatient } from "../controllers/patientController.js";
const router = express();

router.post('/register', registerPatient);
router.post('/login', loginPatient);

const patientRoutes = router;
export default patientRoutes;