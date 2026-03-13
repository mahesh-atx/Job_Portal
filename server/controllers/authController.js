const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, company, bio } = req.body;
    console.log('[REGISTER] Registration attempt for:', email);
    console.log('[REGISTER] Password received (length):', password ? password.length : 0);

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[REGISTER] User already exists');
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      company: role === 'employer' ? company : null,
      bio: bio || (role === 'employer' ? 'Hiring Manager' : '')
    });
    
    console.log('[REGISTER] User created successfully');
    console.log('[REGISTER] Password was hashed:', user.password.startsWith('$2'));

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        bio: user.bio,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Attempting login for email:', email);

    // Check for user
    const user = await User.findOne({ email });
    console.log('[LOGIN] User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('[LOGIN] User not found in database');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await user.comparePassword(password);
    console.log('[LOGIN] Password match:', passwordMatch);

    if (passwordMatch) {
      console.log('[LOGIN] Login successful for user:', user.email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        bio: user.bio,
        skills: user.skills,
        photo: user.photo,
        token: generateToken(user._id)
      });
    } else {
      console.log('[LOGIN] Password mismatch');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};
