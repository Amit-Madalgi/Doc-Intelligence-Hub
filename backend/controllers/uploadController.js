import multer from 'multer';
import path from 'path';

// 1. Setup Storage Engine
const storage = multer.diskStorage({
  // Define where the files will be saved
  destination: (req, file, cb) => {
    // You should create a 'uploads' directory in your backend root
    cb(null, 'uploads/'); 
  },
  // Define the file naming convention
  filename: (req, file, cb) => {
    // Naming: fieldname-timestamp.ext (e.g., document-1678886400000.pdf)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. File Filter (Optional: restrict file types)
const fileFilter = (req, file, cb) => {
  // Check for PDF or DOCX files
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
    // Or, you can pass an error: cb(new Error('Only PDF and DOCX files are allowed!'), false);
  }
};

// 3. Initialize Multer Middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: fileFilter,
});

// 4. Controller function to handle the upload logic
// This will be used in the router with .single('document')
const uploadDocument = (req, res) => {
  if (req.file) {
    // Success: return the path/filename of the uploaded file
    res.json({ 
        message: 'Document uploaded successfully!', 
        filePath: req.file.path, 
        fileName: req.file.filename 
    });
  } else {
    // Handle case where no file was selected or filter failed
    res.status(400).json({ message: 'File upload failed or file type is not supported.' });
  }
};

export { upload, uploadDocument };