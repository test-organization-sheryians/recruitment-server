import * as studentRepository from "../repositories/implementations/student.repository.js";
import { ApiError } from "../utils/ApiError.js";

export const createStudent = async (studentData) => {
  const existingStudent = await studentRepository.findStudentByEmail(
    studentData.email
  );

  if (existingStudent) {
    throw new ApiError(409, "Student with this email already exists");
  }

  const student = await studentRepository.createStudent(studentData);

  return student;
};

export const getAllStudents = async () => {
  const students = await studentRepository.findAllStudents();

  return students;
};

export const getStudentById = async (studentId) => {
  const student = await studentRepository.findStudentById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

export const updateStudent = async (studentId, updateData) => {
  const student = await studentRepository.findStudentById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (updateData.email) {
    const existingStudent = await studentRepository.findStudentByEmail(
      updateData.email
    );

    if (
      existingStudent &&
      existingStudent._id.toString() !== studentId
    ) {
      throw new ApiError(409, "Email already used by another student");
    }
  }

  const updatedStudent = await studentRepository.updateStudentById(
    studentId,
    updateData
  );

  return updatedStudent;
};

export const softDeleteStudent = async (studentId) => {
  const student = await studentRepository.softDeleteStudentById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};