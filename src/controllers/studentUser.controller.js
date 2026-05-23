import StudentUserService from "../services/studentUser.service.js";

class StudentUserController {
    async createUser(req, res, next) {
        try {
            const user = await StudentUserService.createUser(req.body);

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }


    async getAllUsers(req, res, next) {
        try {
            const users = await StudentUserService.getAllUsers();

            res.status(200).json({
                success: true,
                count: users.length,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await StudentUserService.getUserById(req.params.id);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const updatedUser = await StudentUserService.updateUser(
                req.params.id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            await StudentUserService.deleteUser(req.params.id);

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StudentUserController();