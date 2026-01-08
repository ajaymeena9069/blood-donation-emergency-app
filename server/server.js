import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import { PORT } from "./config/env.js";

// routes import...
import donorRoutes from "./routes/donorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import requestRoute from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from "./routes/authRoutes.js";
connectDb();

const app = express();

// middleware...
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173", // frontend origin
        credentials: true,
    })
);

// routes...
app.use('/api/auth', userRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/request', requestRoute);
app.use('/api/admin', adminRoutes);
app.use("/api/notifications", notificationRoutes);


// default route...
app.get('/', (req, res) => {
    res.send("🩸 Blood Donation & Emergency Help API is Running...");
});

app.listen(PORT || 3000, () =>
    console.log(`🚀 Server running on port http://localhost:${PORT}`)
);
