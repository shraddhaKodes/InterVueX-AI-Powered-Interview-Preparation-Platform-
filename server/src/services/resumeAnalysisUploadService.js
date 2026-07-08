import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import { PDFParse } from "pdf-parse";

export const uploadPdfToCloudinaryAndExtractText = async (file) => {
  console.log("Starting PDF upload and text extraction...");

  if (!file || !file.buffer) {
    throw new ErrorHandler(
      "Malformed request: PDF file buffer is required",
      400,
    );
  }

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "resume-analyzer",
          public_id: `resume_${Date.now()}`,
          format: "pdf",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(file.buffer);
  });

  // Parse PDF
  const parser = new PDFParse({
    data: file.buffer,
  });

  try {
    const pdfData = await parser.getText();

    console.log("PDF Result:", pdfData);
    console.log("Text Length:", pdfData.text?.length);

    const extractedText = pdfData.text || "";

    if (!extractedText.trim()) {
      throw new ErrorHandler(
        "Unable to extract text from resume PDF",
        422,
      );
    }

    return {
      resumeUrl: uploadResult?.secure_url || uploadResult?.url,
      resumeText: extractedText,
    };
  } finally {
    await parser.destroy();
  }
};
