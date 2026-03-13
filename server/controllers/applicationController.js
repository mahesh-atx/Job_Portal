const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Seeker only)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      seekerId: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    // Create application
    const application = await Application.create({
      jobId,
      seekerId: req.user._id,
      employerId: job.employerId
    });
    
    const populatedApplication = await Application.findById(application._id)
      .populate('jobId', 'title type salary location')
      .populate('seekerId', 'name email bio skills photo')
      .populate('employerId', 'name company email');
    
    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer of that job only)
const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is the job owner
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('seekerId', 'name email bio skills photo')
      .populate('jobId', 'title type salary location')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get seeker's applications
// @route   GET /api/applications/seeker/:seekerId
// @access  Private (Own applications only)
const getSeekerApplications = async (req, res) => {
  try {
    // Users can only view their own applications
    if (req.params.seekerId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.find({ seekerId: req.params.seekerId })
      .populate('jobId', 'title type salary location')
      .populate('employerId', 'name company email')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is the employer for this application
    if (application.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    application.status = status;
    await application.save();
    
    const populatedApplication = await Application.findById(application._id)
      .populate('jobId', 'title type salary location')
      .populate('seekerId', 'name email bio skills photo')
      .populate('employerId', 'name company email');
    
    res.json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyToJob,
  getApplicationsForJob,
  getSeekerApplications,
  updateApplicationStatus
};
