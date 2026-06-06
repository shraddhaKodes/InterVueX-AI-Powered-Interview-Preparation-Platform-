import mongoose from "mongoose";
import ErrorHandler from "./error.js";

export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler(`Invalid ${paramName}`, 400));
    }

    next();
  };
};

export const validateBodyObjectId = (fieldName = "id") => {
  return (req, res, next) => {
    const id = req.body[fieldName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler(`Invalid ${fieldName}`, 400));
    }

    next();
  };
};

export const validateRequiredFields = (...fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      return req.body[field] === undefined || req.body[field] === null || req.body[field] === "";
    });

    if (missingFields.length) {
      return next(
        new ErrorHandler(`Missing required fields: ${missingFields.join(", ")}`, 400),
      );
    }

    next();
  };
};

export const validatePagination = (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  if (!Number.isInteger(page) || page < 1) {
    return next(new ErrorHandler("Page must be a positive number", 400));
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return next(new ErrorHandler("Limit must be between 1 and 100", 400));
  }

  next();
};
