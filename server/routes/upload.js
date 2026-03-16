const express = require('express');
const router = express.Router();
const { uploadResume, upload } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Note: This route is unprotected so the user can upload a resume *during* registration.
// We could protect it with a separate strategy, but for simplicity we'll allow public uploads
// and depend on the frontend to manage the file URL. To prevent spam, rate limiting should be used in production.
router.post('/resume', upload.single('resume'), uploadResume);

module.exports = router;
