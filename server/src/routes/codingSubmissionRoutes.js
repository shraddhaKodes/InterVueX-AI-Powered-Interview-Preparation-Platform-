import express from "express";
import {
  getSubmissionById,
  getUserSubmissions,
} from "../controllers/codingArenaController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  validateBodyObjectId,
  validatePagination,
} from "../middlewares/validation.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/").get(validatePagination, getUserSubmissions);
router.route("/:id").get(validateBodyObjectId("id"), getSubmissionById);

export default router;
