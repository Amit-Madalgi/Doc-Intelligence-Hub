const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  searchDocuments,
  getQueryHistory, // 👈 NEW IMPORT
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router
  .route('/')
  .post(protect, upload.single('document'), uploadDocument)
  .get(protect, getDocuments);

router.route('/search').post(protect, searchDocuments);

// --- NEW HISTORY ROUTE ---
router.route('/history').get(protect, getQueryHistory);

module.exports = router;