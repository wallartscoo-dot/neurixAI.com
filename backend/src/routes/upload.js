console.log("Upload route loaded");
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
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
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
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

export default router;
