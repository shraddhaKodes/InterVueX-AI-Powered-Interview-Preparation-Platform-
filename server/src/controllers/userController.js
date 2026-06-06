import { User } from "../models/UserSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

// GET CURRENT USER
export const getMe = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE PROFILE
export const updateProfile = catchAsyncErrors(async (req, res) => {
  const updatedData = {
    fullName: req.body.fullName,
    bio: req.body.bio,
    githubURL: req.body.githubURL,
    linkedinURL: req.body.linkedinURL,
    portfolioURL: req.body.portfolioURL,
    leetcodeURL: req.body.leetcodeURL,
    skills: req.body.skills,
  };

  const user = await User.findByIdAndUpdate(req.user.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated",
    user,
  });
});
