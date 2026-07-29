import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import pdf from "pdf-parse";

 f0d7e46 (Fix PDF upload dependencies and update upload route)
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
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
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
    const ext = path.extname(req.file.originalname)
      .toLowerCase();

    let text = "";


    // PDF
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
     const data = await pdf.PDFParse(dataBuffer);
text = data.text;
    }

    // DOCX
    else if (ext === ".docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      text = result.value;
    }

    // TXT
    else if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf8");
    }

    else {
      return res.status(400).json({
        error: "Unsupported file type",

      const filePath = req.file.path;
     if (req.file.mimetype === "application/pdf") {
  const buffer = fs.readFileSync(filePath);

  console.log("Buffer size:", buffer.length);

  const data = await pdf.default(buffer);

  console.log("PDF INFO:", data.info);
  console.log("PDF PAGES:", data.numpages);
  console.log("TEXT LENGTH:", data.text.length);

  extractedText = data.text;
}
       else if (
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
 f0d7e46 (Fix PDF upload dependencies and update upload route)
      });
    }


    res.json({
      success: true,
      filename: req.file.originalname,
      text,
    });


  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      error: "File processing failed",
    });
  }
});


export default router;
