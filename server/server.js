// server.js
import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import { PORT, FRONTEND_URL } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

// routes import...
import donorRoutes from "./routes/donorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import requestRoute from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notification.routes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

connectDb();

const app = express();

// middleware...
app.use(express.json());
app.use(
    cors({
        origin: [FRONTEND_URL, "http://localhost:5173", "https://blood-donation-emergency-app-5jsf.vercel.app"],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

// routes...
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/request', requestRoute);
app.use('/api/admin', adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/stats', statsRoutes);

// default route...
app.get('/', (req, res) => {
    res.send("🩸 Blood Donation & Emergency Help API is Running...");
});

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT || 3000, () =>
    console.log(`🚀 Server running on port http://localhost:${PORT}`)
);