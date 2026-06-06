# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Coding Arena and OnlineCompiler Integration

This project uses a single execution provider for the coding arena: `OnlineCompiler`.

- `RUN CODE` sends source code, language, and custom input to the backend.
- The backend forwards execution requests to `OnlineCompiler` using `ONLINE_COMPILER_BASE_URL` and `ONLINE_COMPILER_API_KEY`.
- The response returns `output`, `error`, `executionTime`, and `memoryUsage`.

### Submission flow

- User submits `problemId`, `language`, and `code`.
- The backend executes the submission against all visible and hidden test cases.
- Hidden test cases are never exposed to the frontend.
- Verdict is determined by comparing `actualOutput.trim()` to `expectedOutput.trim()`.
- The final result includes:
  - `verdict`
  - `passedTestCases`
  - `totalTestCases`
  - `executionTime`
  - `memoryUsage`
  - `testcaseResults`

### Visible test cases

- Visible test cases are shown on the problem detail page.
- Each visible test case displays:
  - Test Case number
  - `Input`
  - `Expected Output`
