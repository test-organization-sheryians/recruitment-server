import TeacherService from "../services/teacher.service.js";

const teacherService = new TeacherService();

class TeacherController {
    async createTeacher(req, res, next) {
        try {
            const teacher = await teacherService.createTeacher(req.body);
            res.status(201).json({ success: true, data: teacher });
        }
        catch (error) {
            next(error);
        }   
    }

    async getTeacher(req, res, next) {
        try {
            const teacher = await teacherService.getTeacherById(req.params.id);
            res.status(200).json({ success: true, data: teacher });
        } catch (error) {
            next(error);
        }
    }

    async updateTeacher(req, res, next) {
        try {
            const updatedTeacher = await teacherService.updateTeacher(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedTeacher });
        } catch (error) {
            next(error);
        }   
    }

    async deleteTeacher(req, res, next) {
        try {
            await teacherService.deleteTeacher(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }   
    }

    async getAllTeachers(req, res, next) {
        try {
            const teachers = await teacherService.getAllTeachers();
            res.status(200).json({ success: true, data: teachers });
        } catch (error) {
            next(error);
        }
    }
}

export default new TeacherController();