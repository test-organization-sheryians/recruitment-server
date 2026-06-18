import UserService from "../services/user.service.js";
import { AppError } from "../utils/errors.js";
import AuthService from "../services/auth.service.js";
import { redisClient } from "../config/redis.js";

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  get cookieOptions() {
    const isProd = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      path: "/",
    };
  }

  refreshTokenController = async (req, res, next) => {
    try {
      // req.refreshToken is already validated by verifyRefreshToken middleware
      const refreshToken = req.refreshToken;

      const tokens = await this.userService.refresh(refreshToken);

      res.cookie("token", tokens.token, {
        ...this.cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  register = async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await this.userService.register(userData);

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", result.token, {
        ...this.cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", result.refreshToken, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const role = result.user?.role?.name?.toLowerCase() || "user";
      res.cookie("role", role, {
        httpOnly: false,
        secure: isProd,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login({ email, password });

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", result.token, {
        ...this.cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", result.refreshToken, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const role = result.user?.role?.name?.toLowerCase() || "user";
      res.cookie("role", role, {
        httpOnly: false,
        secure: isProd,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ success: true, expiresIn: 86400, data: result });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const id = req.query.id;
      const userData = req.body;
      console.log(id, userData, "this is from Update user");
      const user = await this.userService.updateUser(id, userData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const token = req.cookies?.token;

      if (token) {
        const decoded = this.authService.verifyToken(token);
        const exp = decoded.exp * 1000;
        const ttl = Math.floor((exp - Date.now()) / 1000);
        if (ttl > 0) {
          await redisClient.setEx(`bl_${token}`, ttl, "blacklisted");
        }
      }

      res.clearCookie("token", this.cookieOptions);
      res.clearCookie("refreshToken", this.cookieOptions);
      res.clearCookie("role", { path: "/" });

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const result = await this.userService.resetPassword(
        userId,
        oldPassword,
        newPassword,
      );

      if (result) {
        res.status(200).json({
          success: true,
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      if (error.message === "Old password is incorrect") {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
    console.log("LOGIN API HIT", req.body);
  };
}

export default new AuthController();
