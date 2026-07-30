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
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text = "";

    if (ext === ".pdf") {
      text = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (err) => {
          reject(err.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          let extracted = "";

          pdfData.Pages.forEach((page) => {
            page.Texts.forEach((item) => {
              item.R.forEach((r) => {
                extracted += decodeURIComponent(r.T) + " ";
              });
            });
            extracted += "\n";
          });

          resolve(extracted.trim());
        });

        pdfParser.loadPDF(filePath);
      });
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      text = result.value;
    } else if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf8");
    } else {
      return res.status(400).json({
        error: "Unsupported file type",
      });
    }

    console.log("Extracted Text Length:", text.length);

    res.json({
      message: "File uploaded successfully",
      file: req.file.filename,
      text,
    });

  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      error: "File processing failed",
      details: error.message,
    });
  }
});

export default router;