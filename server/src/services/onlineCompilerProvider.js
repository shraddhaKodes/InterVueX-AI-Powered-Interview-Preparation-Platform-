import axios from "axios";
import { ExecutionProvider } from "./executionProvider.js";
import { getOnlineCompilerConfig } from "../config/onlineCompiler.js";
import { languageMap } from "../utils/languageMap.js";
import ErrorHandler from "../middlewares/error.js";

const normalizeText = (value = "") =>
  String(value || "").replace(/\r\n/g, "\n");

const getOnlineCompilerCompiler = (language) => {
  const compiler = languageMap[language];
  if (!compiler) {
    throw new ErrorHandler(`Unsupported language: ${language}`, 400);
  }
  return compiler;
};

const getExecutionVerdict = ({ output, error, status = {} }) => {
  const normalizedError = String(error || "").toLowerCase();

  if (
    status.timedOut ||
    /time limit/.test(normalizedError) ||
    /timed out/.test(normalizedError)
  ) {
    return "time-limit-exceeded";
  }

  if (normalizedError) {
    if (/compile|syntax|parse/.test(normalizedError)) {
      return "compilation-error";
    }
    return "runtime-error";
  }

  return "accepted";
};

export class OnlineCompilerProvider extends ExecutionProvider {
  async execute({ sourceCode, language, input = "" }) {
    if (!sourceCode || !sourceCode.trim()) {
      throw new ErrorHandler("Source code is required", 400);
    }

    const { baseUrl, apiKey, timeoutMs } = getOnlineCompilerConfig();
    const payload = {
      compiler: getOnlineCompilerCompiler(language),
      code: sourceCode,
      input: input || "",
    };

    try {
      const { data } = await axios.post(baseUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        timeout: timeoutMs,
      });

      const result = data?.result ?? data;
      const output = normalizeText(result.output ?? result.stdout ?? "");
      const error = normalizeText(
        result.error ?? result.stderr ?? result.compileOutput ?? "",
      );
      const executionTime = Number(
        result.executionTime ?? result.time ?? result.runtime ?? 0,
      );
      const memoryUsage = Number(
        result.memory ?? result.memoryUsage ?? result.mem ?? 0,
      );
      const status = result.status ?? {};

      return {
        output,
        error,
        executionTime,
        memoryUsage,
        status,
        verdict: getExecutionVerdict({ output, error, status }),
      };
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        throw new ErrorHandler("OnlineCompiler execution timed out", 504);
      }

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors ||
        err.message ||
        "OnlineCompiler execution failed";

      throw new ErrorHandler(
        `OnlineCompiler execution failed: ${message}`,
        502,
      );
    }
  }
}
