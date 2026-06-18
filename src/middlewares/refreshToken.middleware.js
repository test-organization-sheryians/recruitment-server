import { AppError } from "../utils/errors.js";
import { redisClient } from "../config/redis.js";

/**
 * Middleware to verify refresh token exists and is valid
 * Prevents unnecessary 401 errors when no refresh token is present
 */
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Guard: No refresh token provided
    if (!refreshToken) {
      return next(
        new AppError("No refresh token provided. Please login again.", 401),
      );
    }

    // Optional: Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`bl_refresh_${refreshToken}`);
    if (isBlacklisted) {
      return next(new AppError("Refresh token has been revoked.", 401));
    }

    // Attach to request for use in controller
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    next(new AppError("Error validating refresh token.", 500));
  }
};

export default verifyRefreshToken;
