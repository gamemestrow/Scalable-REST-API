const router = require('express').Router();
const { register, login, getMe } = require('../../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../../validators/auth.validator');
const { authenticate } = require('../../middleware/auth.middleware');

// POST /api/v1/auth/register
router.post('/register', registerValidator, register);

// POST /api/v1/auth/login
router.post('/login', loginValidator, login);

// GET /api/v1/auth/me  (protected)
router.get('/me', authenticate, getMe);

module.exports = router;