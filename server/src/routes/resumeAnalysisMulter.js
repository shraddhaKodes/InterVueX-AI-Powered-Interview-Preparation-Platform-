import multer from "multer";

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
