const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByEmployer
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllJobs);
router.get('/employer/:employerId', getJobsByEmployer);
router.get('/:id', getJobById);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;
