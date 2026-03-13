const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const { search, type, location } = req.query;
    
    let query = {};
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    const jobs = await Job.find(query)
      .populate('employerId', 'name company email')
      .sort({ postedAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employerId', 'name company email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
  try {
    const { title, type, salary, location, description } = req.body;
    
    // Ensure description handles newlines if plain text
    let desc = description;
    if (!desc.includes('<p>')) {
      desc = desc.split('\n').map(line => line.trim() ? `<p class="mb-2">${line}</p>` : '').join('');
    }
    
    const job = await Job.create({
      title,
      type,
      salary,
      location,
      description: desc,
      employerId: req.user._id
    });
    
    const populatedJob = await Job.findById(job._id)
      .populate('employerId', 'name company email');
    
    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer who posted it)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is the job owner
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    const { title, type, salary, location, description } = req.body;
    
    // Ensure description handles newlines if plain text
    let desc = description;
    if (!desc.includes('<p>')) {
      desc = desc.split('\n').map(line => line.trim() ? `<p class="mb-2">${line}</p>` : '').join('');
    }
    
    job.title = title || job.title;
    job.type = type || job.type;
    job.salary = salary || job.salary;
    job.location = location || job.location;
    job.description = desc || job.description;
    
    const updatedJob = await job.save();
    const populatedJob = await Job.findById(updatedJob._id)
      .populate('employerId', 'name company email');
    
    res.json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer who posted it)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is the job owner
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    
    await job.deleteOne();
    
    // Also delete all applications for this job
    const Application = require('../models/Application');
    await Application.deleteMany({ jobId: req.params.id });
    
    res.json({ message: 'Job and related applications deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get jobs by employer
// @route   GET /api/jobs/employer/:employerId
// @access  Public
const getJobsByEmployer = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId })
      .populate('employerId', 'name company email')
      .sort({ postedAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByEmployer
};
