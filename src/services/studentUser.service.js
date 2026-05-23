import userRepository from "../repositories/implementations/mongoStudentUserRepository.js";

class StudentUserService {
    async createUser(userData) {
        const existingUser = await userRepository.getAllUsers();

        return await userRepository.createUser(userData);
    }

    async getAllUsers() {
        return await userRepository.getAllUsers();
    }

    async getUserById(id) {
        const user = await userRepository.getUserById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async updateUser(id, data) {
        const updatedUser = await userRepository.updateUser(id, data);

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    }

    async deleteUser(id) {
        const deletedUser = await userRepository.deleteUser(id);

        if (!deletedUser) {
            throw new Error("User not found");
        }

        return deletedUser;
    }
}

export default new StudentUserService();