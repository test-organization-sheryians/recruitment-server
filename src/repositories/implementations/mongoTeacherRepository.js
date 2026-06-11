import IteacherRepository from "../contracts/ITeacherRepository.js";
import Teacher from "../../models/teacher.model.js";

import mongoose from "mongoose";
import { AppError } from "../../utils/errors.js";


class MongoTeacherRepository extends IteacherRepository {
    async createTeacher(teacherData) {
        try {
            const teacher = new Teacher(teacherData);
            return await teacher.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError("Email already exists", 409);
              } 
                throw new AppError("Failed to create teacher", 500);
        }
    }

    async getTeacherById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Teacher ID", 400);
          }
        try {
            return await Teacher.findById(id).lean();
        } catch (error) {
            throw new AppError("Failed to find teacher", 500);
        }           
    }

    async updateTeacher(id, teacherData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Teacher ID", 400);
          }
        try {
            return await Teacher.findByIdAndUpdate(
                id,

                teacherData,
                { new: true, runValidators: true }
            ).lean();
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError("Email already exists", 409);
              }
                throw new AppError("Failed to update teacher", 500);
        }
    }

    async deleteTeacher(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Teacher ID", 400);
          }
        try {
            return await Teacher.findByIdAndDelete(id).lean();
        } catch (error) {
            throw new AppError("Failed to delete teacher", 500);
        }
    }

    async getAllTeachers() {
        try {
            return await Teacher.find().lean();
        } catch (error) {
            throw new AppError("Failed to retrieve teachers", 500);
        }
    }
}

export default MongoTeacherRepository;