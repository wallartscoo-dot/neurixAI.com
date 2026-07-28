import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import PDFParser from "pdf2json";
import mammoth from "mammoth";

console.log("Upload route loaded");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

router.post("/", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    console.log("Upload endpoint hit");

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    let extractedText = "";
    
    try {
      const filePath = req.file.path;

      if (req.file.mimetype === "application/pdf") {
        const pdfParser = new PDFParser();

        extractedText = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData) => {
            reject(errData.parserError);
          });

         pdfParser.on("pdfParser_dataReady", () => {
  const text = pdfParser.getRawTextContent();

  console.log("PDF RAW TEXT:");
  console.log(text);

  resolve(text);
});

          pdfParser.loadPDF(filePath);
        });
      } else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          path: filePath,
        });

        extractedText = result.value;
      } else if (req.file.mimetype === "text/plain") {
        extractedText = fs.readFileSync(filePath, "utf8");
      }

      console.log("Extracted Text:");
      console.log(extractedText);

      res.json({
        message: "File uploaded successfully",
        file: req.file.filename,
        text: extractedText,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to read document",
      });
    }
  });
});

export default router;
