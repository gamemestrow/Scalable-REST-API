const UserModel = require('../models/User');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// ─── Get All Users (Admin) ─────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await UserModel.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    return paginatedResponse(res, {
      data: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }, 'Users fetched successfully');
  } catch (err) {
    console.error('Get all users error:', err);
    return errorResponse(res, 'Failed to fetch users', 500);
  }
};

// ─── Get Single User (Admin) ───────────────────────────
const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user, 'User fetched successfully');
  } catch (err) {
    console.error('Get user error:', err);
    return errorResponse(res, 'Failed to fetch user', 500);
  }
};

// ─── Get My Profile ────────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user, 'Profile fetched successfully');
  } catch (err) {
    console.error('Get profile error:', err);
    return errorResponse(res, 'Failed to fetch profile', 500);
  }
};

// ─── Delete User (Admin) ───────────────────────────────
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return errorResponse(res, 'You cannot delete your own account', 400);
    }

    const deleted = await UserModel.deleteById(req.params.id);
    if (!deleted) return errorResponse(res, 'User not found', 404);

    return successResponse(res, null, 'User deleted successfully');
  } catch (err) {
    console.error('Delete user error:', err);
    return errorResponse(res, 'Failed to delete user', 500);
  }
};

module.exports = { getAllUsers, getUser, getMyProfile, deleteUser };