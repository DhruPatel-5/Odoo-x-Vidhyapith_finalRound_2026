const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Generate a signed JWT for the given user id. */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * POST /api/auth/signup
 * Body: { name, email, password, role }
 */
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = signToken(user._id);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

/**
 * GET /api/auth/me
 * Returns current user from token (attached by authMiddleware).
 */
const me = async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

/**
 * GET /api/auth/users  (admin only)
 * Returns all users (for dropdowns).
 */
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ name: 1 });
  res.json(users);
};

module.exports = { signup, login, me, getAllUsers };
