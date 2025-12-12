import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";


const upload_dir = path.join(import.meta.dirname, "../../../samples/uploads/");
if (!fs.existsSync(upload_dir)) {
  fs.mkdirSync(upload_dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, upload_dir);
  },
  filename: (req, file, cb) => {
    const uniqueName: string = `${Date.now()}_${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Only PDFs are allowed!"), false);
  }
  else {
    cb(null, true);
  }
};


export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

