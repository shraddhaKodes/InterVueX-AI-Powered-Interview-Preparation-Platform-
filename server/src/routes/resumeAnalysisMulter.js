import multer from "multer";
import ErrorHandler from "../middlewares/error.js";

// In-memory storage so we can upload the PDF buffer to Cloudinary and parse with pdf-parse.
const storage = multer.memoryStorage();

export const uploadResumePdf = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

export const handleResumeUpload = (req, res, next) => {
  uploadResumePdf.single("resume")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume PDF must be 10MB or smaller"
          : error.message;

      return next(new ErrorHandler(message, statusCode));
    }

    return next(new ErrorHandler(error.message, 400));
  });
};
