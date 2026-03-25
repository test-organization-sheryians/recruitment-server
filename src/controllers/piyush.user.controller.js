import UserService from "../services/piyushUser.services.js";

class UserController {
  constructor() {
    this.userService = new UserService();

    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user
      });

    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });

    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);

      return res.status(200).json({
        success: true,
        data: user
      });

    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      const user = await this.userService.updateUser(userId, updateData);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
      });

    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;

      await this.userService.deleteUser(userId);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });

    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();