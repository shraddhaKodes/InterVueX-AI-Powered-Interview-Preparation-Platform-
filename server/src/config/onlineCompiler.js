import ErrorHandler from "../middlewares/error.js";

export const validateOnlineCompilerConfig = () => {
  const required = ["ONLINE_COMPILER_BASE_URL", "ONLINE_COMPILER_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new ErrorHandler(
      `OnlineCompiler provider not configured. Missing: ${missing.join(", ")}`,
      500,
    );
  }
};

export const getOnlineCompilerConfig = () => ({
  baseUrl: process.env.ONLINE_COMPILER_BASE_URL.replace(/\/$/, ""),
  apiKey: process.env.ONLINE_COMPILER_API_KEY,
  timeoutMs: Number(process.env.ONLINE_COMPILER_TIMEOUT_MS) || 15000,
});
