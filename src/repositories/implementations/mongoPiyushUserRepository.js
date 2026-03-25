import IPiyushUserRepository from "../contracts/IPiyushUserRepository.js";
import User from "../../models/piyush-usermodel.js";

class UserRepositoryImpl extends IPiyushUserRepository {

  async create(userData) {
    return await User.create(userData);
  }

  async findAll() {
    return await User.find();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default UserRepositoryImpl;