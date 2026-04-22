const router = require('express').Router();
const { getAllUsers, getUser, getMyProfile, deleteUser } = require('../../controllers/user.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

// All user routes require login
router.use(authenticate);

// GET /api/v1/users/me  → get my profile
router.get('/me', getMyProfile);

// Admin only routes
router.get('/',       adminOnly, getAllUsers);
router.get('/:id',    adminOnly, getUser);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;