import UserService from "../services/user.service.js";

const userService = new UserService()

class UserController {
  constructor() {
    this.userService = new UserService();

   
    this.getMe = this.getMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this); 
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
 
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

 async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

  const updatedUser = await this.userService.updateUserRole(id, role);      return res.status(200).json({
        message: "User role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
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

    console.log("Deleting user:", userId); 

    const deleted = await this.userService.deleteUser(userId);

    console.log("Deleted user:", deleted); 
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err); 
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

}

export default new UserController();
