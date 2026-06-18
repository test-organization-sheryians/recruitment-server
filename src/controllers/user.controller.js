import UserService from "../services/user.service.js";

const userService = new UserService();

class UserController {
  constructor() {
    this.userService = new UserService();

    // Bind all methods
    this.getMe = this.getMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
    this.blastUsers = this.blastUsers.bind(this);
  }

  async getMe(req, res, next) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await this.userService.getUser(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      console.log("User role in getMe:", user.role);

      return res.status(200).json({
        success: true,
        data: {
          id: user.id || user._id,
          email: user.email,

          // 🔥 FIX: safe role handling
          role: user.role?.name || null,

          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (err) {
      console.log("GET ME ERROR:", err);
      next(err);
    }
  }

  async updateMe(req, res, next) {
    try {
      const userId = req.userId;
      const updated = await this.userService.updateUser(userId, req.body);

      return res.status(200).json({
        success: true,
        data: {
          id: updated.id || updated._id,
          email: updated.email,
          role: updated.role?.name,
          firstName: updated.firstName || updated.name?.firstName,
          lastName: updated.lastName || updated.name?.lastName,
          phoneNumber: updated.phoneNumber,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async searchUser(req, res, next) {
    try {
      const searchQuery = (req.query.searchQuery || "").trim();

      if (!searchQuery) {
        return res.status(200).json({
          success: true,
          message: "No search term provided",
          count: 0,
          data: [],
        });
      }

      const users = await this.userService.findUser(searchQuery);

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error("Search users error:", error);
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || ""; // search by name
      const result = await this.userService.getAllUsers(page, limit, search);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: "Users fetched successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;

      console.log("Deleting user:", userId);

      const deleted = await this.userService.deleteUser(userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err) {
      console.error("Delete user error:", err);
      next(err);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;

      if (!roleId) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
        });
      }

      const updatedUser = await this.userService.updateUserRole(id, roleId);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const safeUser = {
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        isVerified: updatedUser.isVerified,
        role: updatedUser.role
          ? { _id: updatedUser.role._id, name: updatedUser.role.name }
          : null,
      };

      return res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user: safeUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async blastUsers(req, res, next) {
    try {
      const { userIds, subject, message } = req.body;

      if (!userIds || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No users selected",
        });
      }

      if (!subject || !message) {
        return res.status(400).json({
          success: false,
          message: "Subject and message are required",
        });
      }

      const result = await this.userService.blastUsers({
        userIds,
        subject,
        message,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
