import { OnlineCompilerProvider } from "./onlineCompilerProvider.js";

const provider = new OnlineCompilerProvider();

export const executeCode = async ({ sourceCode, language, input = "" }) => {
  return provider.execute({ sourceCode, language, input });
};
