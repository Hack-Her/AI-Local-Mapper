const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ai_local_mapper_jwt_super_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // In-memory / DB user check
    const userExists = await User.findOne({ email }).catch(() => null);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashedPassword
      });
    } catch (dbErr) {
      // Fallback response for dev without active DB
      user = { _id: Date.now().toString(), name, email };
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).catch(() => null);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences || {}
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').catch(() => null);
    if (!user) {
      return res.json({
        success: true,
        user: { id: req.user.id, name: 'Demo User', email: 'user@example.com' }
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
