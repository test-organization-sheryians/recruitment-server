import { Student } from "../models/student.model.js";

export const createStudent = async (studentData) => {
  return await Student.create(studentData);
};

export const findAllStudents = async () => {
  return await Student.find({ isActive: true }).sort({ createdAt: -1 });
};

export const findStudentById = async (studentId) => {
  return await Student.findOne({
    _id: studentId,
    isActive: true
  });
};

export const findStudentByEmail = async (email) => {
  return await Student.findOne({ email });
};

export const updateStudentById = async (studentId, updateData) => {
  return await Student.findOneAndUpdate(
    {
      _id: studentId,
      isActive: true
    },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
};

export const softDeleteStudentById = async (studentId) => {
  return await Student.findOneAndUpdate(
    {
      _id: studentId,
      isActive: true
    },
    {
      isActive: false
    },
    {
      new: true
    }
  );
};