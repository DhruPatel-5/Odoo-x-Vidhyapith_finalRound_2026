/**
 * Role-based access control middleware factory.
 * Usage: requireRole('admin', 'engineering')
 * Returns a middleware that rejects users whose role is not in the list.
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { requireRole };
