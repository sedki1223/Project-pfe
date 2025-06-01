import multer from "multer";

// Use memoryStorage instead of diskStorage for serverless environments
const upload = multer({ storage: multer.memoryStorage() });

export default upload;
