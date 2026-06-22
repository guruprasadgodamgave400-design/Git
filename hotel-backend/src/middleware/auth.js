const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

const auth = asyncHandler(async function authMiddleware(req, _res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }
  const token = header.slice(7).trim();
  if (!token) throw new ApiError(401, "Authentication required");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, "Server misconfigured: JWT_SECRET missing");

  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.sub);
  if (!user) throw new ApiError(401, "Invalid token: user no longer exists");

  req.user = user;
  next();
});

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Insufficient permissions"));
    }
    next();
  };
}

module.exports = { auth, requireRole };