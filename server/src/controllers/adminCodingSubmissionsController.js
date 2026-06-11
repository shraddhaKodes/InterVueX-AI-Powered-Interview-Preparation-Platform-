import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  getAllSubmissionsService,
  getSubmissionByIdAdminService,
} from "../services/adminCodingSubmissionsService.js";

export const getAdminSubmissions = catchAsyncErrors(async (req, res) => {
  const result = await getAllSubmissionsService(req.query);
  res.status(200).json({
    success: true,
    message: "Admin submissions fetched successfully",
    data: result,
  });
});

export const getAdminSubmissionById = catchAsyncErrors(async (req, res) => {
  const submission = await getSubmissionByIdAdminService(req.params.id);
  res.status(200).json({
    success: true,
    message: "Admin coding submission fetched successfully",
    data: { submission },
  });
});
