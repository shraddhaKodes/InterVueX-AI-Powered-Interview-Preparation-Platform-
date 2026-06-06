export class ExecutionProvider {
  async execute({ sourceCode, language, input }) {
    throw new Error(
      "ExecutionProvider.execute() must be implemented by a provider",
    );
  }
}
