import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {
  createProblemService,
  updateProblemService,
  deleteProblemService,
} from "../services/codingArenaAdminService.js";

export const createProblem = catchAsyncErrors(async (req, res, next) => {
  const { title, slug, difficulty, description } = req.body;
  if (!title || !slug || !difficulty || !description) {
    return next(new ErrorHandler("Missing required fields", 400));
  }

  const allowed = ["easy", "medium", "hard"];
  if (!allowed.includes(difficulty)) {
    return next(new ErrorHandler("Invalid difficulty value", 400));
  }

  const problem = await createProblemService({
    payload: req.body,
    userId: req.user?.id,
  });

  res
    .status(201)
    .json({
      success: true,
      message: "Problem created successfully",
      data: { problem },
    });
});

export const updateProblem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, slug, difficulty, description } = req.body;

  if (!title || !slug || !difficulty || !description) {
    return next(new ErrorHandler("Missing required fields", 400));
  }

  const allowed = ["easy", "medium", "hard"];
  if (!allowed.includes(difficulty)) {
    return next(new ErrorHandler("Invalid difficulty value", 400));
  }

  const problem = await updateProblemService({
    id,
    payload: req.body,
    userId: req.user?.id,
  });

  res
    .status(200)
    .json({
      success: true,
      message: "Problem updated successfully",
      data: { problem },
    });
});

export const deleteProblem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  await deleteProblemService({ id });
  res
    .status(200)
    .json({ success: true, message: "Problem deleted successfully", data: {} });
});
