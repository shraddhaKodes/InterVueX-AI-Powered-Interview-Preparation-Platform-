import express from "express";
import { listUsers } from "../controllers/adminUserController.js";
import { isAuthenticated, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

router.get("/admin/users", isAuthenticated, restrictTo("admin"), listUsers);

export default router;
