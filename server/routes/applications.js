const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getApplicationsForJob,
  getSeekerApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, applyToJob);
router.get('/job/:jobId', protect, getApplicationsForJob);
router.get('/seeker/:seekerId', protect, getSeekerApplications);
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;
