import teacherCrud from "../repositories/implementations/mongoTeacherRepository.js";
import { AppError } from "../utils/errors.js";

class TeacherService {
    constructor() {
        this.teacherRepository = new teacherCrud();
    }

    async createTeacher(teacherData) {
        if (!teacherData.name || !teacherData.email || !teacherData.password || !teacherData.subject) {
            throw new AppError("All fields are required", 400);
        }
        return await this.teacherRepository.createTeacher(teacherData);
    }

    async getTeacherById(id) {
        return await this.teacherRepository.getTeacherById(id);
    }

    async updateTeacher(id, teacherData) {
        return await this.teacherRepository.updateTeacher(id, teacherData);
    }

    async deleteTeacher(id) {
        return await this.teacherRepository.deleteTeacher(id);
    }
}

export default TeacherService;