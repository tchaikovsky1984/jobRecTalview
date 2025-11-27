import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

import { displayLog } from "./LoggingRequests.ts";

function isRealPath(filepath: string): boolean {
  if (!fs.existsSync(filepath)) {
    displayLog("Path does not exist.", "ERR");
    return false;
  }
  return true;
}

const upload_dir = path.join(import.meta.dirname, "../../../samples/uploads/");
if (!fs.existsSync(upload_dir)) {
  fs.mkdirSync(upload_dir);
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

