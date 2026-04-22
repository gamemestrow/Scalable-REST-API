const TaskModel = require('../models/Task');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// ─── Create Task ───────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const task = await TaskModel.create({
      userId: req.user.id,
      title,
      description,
      priority,
      dueDate: due_date,
    });
    return successResponse(res, task, 'Task created successfully', 201);
  } catch (err) {
    console.error('Create task error:', err);
    return errorResponse(res, 'Failed to create task', 500);
  }
};

// ─── Get My Tasks ──────────────────────────────────────
const getMyTasks = async (req, res) => {
  try {
    const { page, limit, status, priority } = req.query;
    const result = await TaskModel.findByUserId(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      priority,
    });
    return paginatedResponse(res, {
      data: result.tasks,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }, 'Tasks fetched successfully');
  } catch (err) {
    console.error('Get tasks error:', err);
    return errorResponse(res, 'Failed to fetch tasks', 500);
  }
};

// ─── Get All Tasks (Admin) ─────────────────────────────
const getAllTasks = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const result = await TaskModel.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
    });
    return paginatedResponse(res, {
      data: result.tasks,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }, 'All tasks fetched successfully');
  } catch (err) {
    console.error('Get all tasks error:', err);
    return errorResponse(res, 'Failed to fetch tasks', 500);
  }
};

// ─── Get Single Task ───────────────────────────────────
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';

    const task = isAdmin
      ? await TaskModel.findById(id)
      : await TaskModel.findByIdAndUser(id, req.user.id);

    if (!task) return errorResponse(res, 'Task not found', 404);

    return successResponse(res, task, 'Task fetched successfully');
  } catch (err) {
    console.error('Get task error:', err);
    return errorResponse(res, 'Failed to fetch task', 500);
  }
};

// ─── Update Task ───────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';
    const task = await TaskModel.updateById(id, req.user.id, req.body, isAdmin);
    if (!task) return errorResponse(res, 'Task not found or unauthorized', 404);
    return successResponse(res, task, 'Task updated successfully');
  } catch (err) {
    console.error('Update task error:', err);
    return errorResponse(res, 'Failed to update task', 500);
  }
};

// ─── Delete Task ───────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';
    const deleted = await TaskModel.deleteById(id, req.user.id, isAdmin);
    if (!deleted) return errorResponse(res, 'Task not found or unauthorized', 404);
    return successResponse(res, null, 'Task deleted successfully');
  } catch (err) {
    console.error('Delete task error:', err);
    return errorResponse(res, 'Failed to delete task', 500);
  }
};

module.exports = { createTask, getMyTasks, getAllTasks, getTask, updateTask, deleteTask };