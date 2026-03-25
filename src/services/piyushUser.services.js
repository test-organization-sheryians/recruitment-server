import UserRepositoryImpl from "../repositories/implementations/mongoPiyushUserRepository.js";

class UserService {
  constructor() {
    this.userRepo = new UserRepositoryImpl();
  }

  async createUser(data) {
    if (!data.email) {
      throw new Error("Email is required");
    }
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    return await this.userRepo.create(data);
  }

  async getAllUsers() {
    return await this.userRepo.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id, data) {
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    return await this.userRepo.update(id, data);
  }

  async deleteUser(id) {
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    return await this.userRepo.delete(id);
  }
}

export default UserService;