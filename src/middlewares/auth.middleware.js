const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const tokenService = require('../services/token.service');
const User = require('../models/User.model');

const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

const protect = asyncHandler(async (req, res, next) => {
  const token = extractTokenFromHeader(req);

  if (!token) {
    throw new ApiError(401, 'Authorization token missing or invalid');
  }

  try {
    const decoded = tokenService.verifyToken(token);

    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user.toJSON();

    return next();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(401, 'Invalid or expired token');
  }
});

module.exports = {
  protect,
};

