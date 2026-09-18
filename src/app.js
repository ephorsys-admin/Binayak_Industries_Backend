import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

const app = express();

// =====================================================
// Security Headers
// =====================================================

app.use(helmet());

// =====================================================
// Rate Limiting
// =====================================================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

app.use("/api", limiter);

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// =====================================================
// Body Parser
// =====================================================

app.use(express.json({ limit: "20mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "20mb",
    })
);

// =====================================================
// Cookie Parser
// =====================================================

app.use(cookieParser());

// =====================================================
// Security Middleware
// =====================================================

// Removed express-mongo-sanitize
// Removed xss-clean

app.use(hpp());

// =====================================================
// Logger
// =====================================================

app.use(morgan("dev"));

// =====================================================
// API Routes
// =====================================================

app.use("/api/v1", router);

// =====================================================
// 404 Handler
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// =====================================================
// Global Error Handler
// =====================================================

app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;