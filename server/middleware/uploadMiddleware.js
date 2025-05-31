import multer from "multer";

const upload = multer({ storage: multer.diskStorage() });

export default upload;

// This middleware uses multer to handle file uploads on disk.
// It can be used in routes to process file uploads, such as images for hotels.