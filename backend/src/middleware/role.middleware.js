const { errorResponse } = require('../utils/response');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
    }

    next();
  };
};

// Shorthand middlewares
const adminOnly = authorizeRoles('admin');
const userOrAdmin = authorizeRoles('user', 'admin');

module.exports = { authorizeRoles, adminOnly, userOrAdmin };