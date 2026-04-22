const router = require('express').Router();
const { createTask, getMyTasks, getAllTasks, getTask, updateTask, deleteTask } = require('../../controllers/task.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

// All task routes require login
router.use(authenticate);

// GET /api/v1/tasks         → my tasks
// POST /api/v1/tasks        → create task
router.get('/',    getMyTasks);
router.post('/',   createTask);

// Admin only — get all tasks
router.get('/admin/all', adminOnly, getAllTasks);

// GET/PUT/DELETE /api/v1/tasks/:id
router.get('/:id',    getTask);
router.put('/:id',    updateTask);
router.delete('/:id', deleteTask);

module.exports = router;