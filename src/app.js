import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";


const app = express();

// ---------------------------------------------
// Security Headers
// ---------------------------------------------
app.use(helmet());

// ---------------------------------------------
// Rate Limiting
// ---------------------------------------------
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

app.use("/api", limiter);

// ---------------------------------------------
// CORS Configuration
// ---------------------------------------------
const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

// ---------------------------------------------
// Body Parser
// ---------------------------------------------
app.use(express.json({ limit: "20mb" }));


app.use(
    express.urlencoded({
        extended: true,
        limit: "20mb",
    }),
);

// ---------------------------------------------
// Cookie Parser
// ---------------------------------------------
app.use(cookieParser());

// ---------------------------------------------
// Security Middleware
// ---------------------------------------------
app.use(mongoSanitize()); // MongoDB Injection Protection
app.use(xss()); // XSS Protection
app.use(hpp()); // HTTP Parameter Pollution Protection

// ---------------------------------------------
// Logger
// ---------------------------------------------
app.use(morgan("dev"));

// ---------------------------------------------
// API Routes
// ---------------------------------------------
app.use("/api/v1", router);


export default app;
