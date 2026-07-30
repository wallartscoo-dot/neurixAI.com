import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdf from "pdf-parse";
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
      const buffer = fs.readFileSync(filePath);

      console.log("PDF Size:", buffer.length);

      const data = await pdf(buffer);

      console.log("Pages:", data.numpages);
      console.log("First 300 chars:", data.text.substring(0, 300));

      text = data.text ? data.text.trim() : "";

      console.log("Extracted Text Length:", text.length);
    }

    else if (ext === ".docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      text = result.value;
    }

    else if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf8");
    }

    else {
      return res.status(400).json({
        error: "Unsupported file type",
      });
    }

    console.log("Final Text Length:", text.length);

    res.json({
      success: true,
      filename: req.file.originalname,
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
