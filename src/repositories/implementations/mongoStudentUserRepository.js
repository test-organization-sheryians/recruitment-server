import User from "../../models/StudentUser.model.js";
import StudentUserRepositoryContract from "../contracts/IStudentUserRepository.js";

class mongoStudentUserRepository extends StudentUserRepositoryContract {
    async createUser(userData) {
        return await User.create(userData);
    }

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async updateUser(id, data) {
        return await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new mongoStudentUserRepository();