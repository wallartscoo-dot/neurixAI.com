import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

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
    fileSize: 10 * 1024 * 1024, // 10MB
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
  upload.single("file")(req, res, (err) => {
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

    res.json({
      message: "File uploaded successfully",
      file: req.file.filename,
    });
  });
});
export default router;
