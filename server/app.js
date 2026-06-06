import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";
import mockInterviewRoutes from "./src/routes/mockInterviewRoutes.js";
import resumeAnalysisRoutes from "./src/routes/resumeAnalysisRoutes.js";
import codingSubmissionRoutes from "./src/routes/codingSubmissionRoutes.js";
import codingArenaRoutes from "./src/routes/codingArenaRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import creditUsageRoutes from "./src/routes/creditUsageRoutes.js";

import { errorMiddleware } from "./src/middlewares/error.js";
import { validateOnlineCompilerConfig } from "./src/config/onlineCompiler.js";

// APP
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
// Load environment variables from src/.env when running from project root
dotenv.config({
  path: path.join(__dirname, "src/.env"),
});

validateOnlineCompilerConfig();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PORTFOLIO_URL,
  process.env.DASHBOARD_URL,
].filter(Boolean);

const isLocalOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (
        !requestOrigin ||
        allowedOrigins.includes(requestOrigin) ||
        isLocalOrigin(requestOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NOTE: express-fileupload can conflict with multipart handling (e.g., multer).
// This app relies on multer for resume uploads; keep express-fileupload for legacy endpoints only if needed.
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "./tmp/",
//   }),
// );

// TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Interview Platform API Running",
  });
});

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/interviews", interviewRoutes);
app.use("/api/v1/mock-interviews", mockInterviewRoutes);
app.use("/api/v1/resume-analysis", resumeAnalysisRoutes);
app.use("/api/v1/coding-submissions", codingSubmissionRoutes);
app.use("/api/v1/coding-arena", codingArenaRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/credit-usage", creditUsageRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/mock-interviews", mockInterviewRoutes);
app.use("/api/resume-analysis", resumeAnalysisRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/credit-usage", creditUsageRoutes);

app.use(errorMiddleware);

// DATABASE CONNECTION
connectDB();

export default app;
