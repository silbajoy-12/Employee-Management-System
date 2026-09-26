// Middleware that checks whether a user is logged in (session-based).
// If not logged in, request is rejected with 401 Unauthorized.
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized. Please log in first." });
}

module.exports = { requireAuth };
