const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

// ─── Register ──────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const exists = await UserModel.emailExists(email);
    if (exists) {
      return errorResponse(res, 'Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await UserModel.create({ name, email, hashedPassword });

    // Generate tokens
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(res, { user, token }, 'Account created successfully', 201);

  } catch (err) {
    console.error('Register error:', err);
    return errorResponse(res, 'Registration failed', 500);
  }
};

// ─── Login ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate tokens
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(res, {
      user: userWithoutPassword,
      token,
      refreshToken,
    }, 'Login successful');

  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 'Login failed', 500);
  }
};

// ─── Get Me ────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, { user }, 'Profile fetched successfully');
  } catch (err) {
    console.error('GetMe error:', err);
    return errorResponse(res, 'Failed to fetch profile', 500);
  }
};

module.exports = { register, login, getMe };