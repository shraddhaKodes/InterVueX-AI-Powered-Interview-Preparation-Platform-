import express from "express";
import {
  listProblems,
  getProblemById,
  runCode,
  submitSolution,
  getUserSubmissions,
  getSubmissionById,
} from "../controllers/codingArenaController.js";
import {
  isAuthenticated,
  optionalAuthentication,
  restrictTo,
} from "../middlewares/auth.js";
import {
  validateBodyObjectId,
  validateRequiredFields,
} from "../middlewares/validation.js";
import {
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/codingArenaAdminController.js";

const router = express.Router();

router.get("/problems", optionalAuthentication, listProblems);
router.get("/problems/:id", optionalAuthentication, getProblemById);

// Admin CRUD for problems
router.post("/problems", isAuthenticated, restrictTo("admin"), createProblem);
router.put(
  "/problems/:id",
  isAuthenticated,
  restrictTo("admin"),
  updateProblem,
);
router.delete(
  "/problems/:id",
  isAuthenticated,
  restrictTo("admin"),
  deleteProblem,
);

router.post(
  "/run",
  isAuthenticated,
  validateRequiredFields("sourceCode", "language"),
  runCode,
);
router.post(
  "/submit",
  isAuthenticated,
  validateRequiredFields("problemId", "sourceCode", "language"),
  validateBodyObjectId("problemId"),
  submitSolution,
);

router.get("/submissions", isAuthenticated, getUserSubmissions);
router.get(
  "/submissions/:id",
  isAuthenticated,
  validateBodyObjectId("id"),
  getSubmissionById,
);

export default router;
