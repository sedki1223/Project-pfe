import multer from "multer";
import fs from "fs";
import path from "path";

// A function to create the upload directory if it doesn't exist
const ensureUploadPath = (folder = "uploads") => {
  const uploadPath = path.join(process.cwd(), folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Create storage dynamically
const createStorage = (folder = "uploads") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = ensureUploadPath(folder);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
  });

// Allow only image uploads (optional)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Export a preconfigured upload middleware (single file)
const upload = multer({
  storage: createStorage("uploads"), // can customize the folder name
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max size
});

export default upload;
