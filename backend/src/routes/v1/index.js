const router = require('express').Router();

// ─── Mount Routes ──────────────────────────────────────
router.use('/auth',  require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/tasks', require('./task.routes'));

module.exports = router;