import UserService from "../services/user.service.js";

class UserController {
  constructor() {
    this.userService = new UserService();

   
    this.getMe = this.getMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this); 
    this.deleteUser = this.deleteUser.bind(this); 
  }

  
  async getMe(req, res, next) {
    try {
      const userId = req.userId;
      const user = await this.userService.getUser(userId);
       console.log( " user >> " ,user)

      return res.status(200).json({
        success: true,
        data: {
          id: user.id || user._id,
          email: user.email,
          role: {
            _id: user.role._id,
            name: user.role.name,
            description: user.role.description,
          },
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (err) {
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
          role: updated.role,
          firstName: updated.firstName || updated.name?.firstName,
          lastName: updated.lastName || updated.name?.lastName,
          phoneNumber: updated.phoneNumber,
        },
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
        data: users,
        message: "Users fetched successfully",
      });
    } catch (err) {
      next(err);
    }
  }
  async deleteUser(req, res, next) {
  try {
    const userId = req.params.id;

    console.log("Deleting user:", userId); // ✅ log userId

    const deleted = await this.userService.deleteUser(userId);

    console.log("Deleted user:", deleted); // ✅ log result
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err); // ✅ log full error
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

}

export default new UserController();
