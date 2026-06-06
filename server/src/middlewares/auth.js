import { User } from "../models/UserSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Unauthorized: No token provided!", 401));
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch user from DB
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(
        new ErrorHandler("User not found. Authentication failed!", 401),
      );
    }

    next();
  } catch (error) {
    console.log("error in the authenticate");
    return next(
      new ErrorHandler("Invalid or Expired Token. Please login again!", 401),
    );
  }
});

export const optionalAuthentication = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
    } catch {
      req.user = null;
    }

    next();
  },
);

///as your previous project service > auth.js (setuser and get user using jsonwebtoken ) not using statefull authentication
//memory extensive using map

// Middleware for role-based access control
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "You do not have permission to perform this action",
          403,
        ),
      );
    }

    next();
  };
}
