import mongoose from "mongoose"
import StudentProfileModel from "../../models/Student.model.js"
import StudentProfile from "../contracts/StudentRepository"

class MongoStudent extends StudentProfile{
    async StudentProfilecreate (data){
      try{
        const StudentProfile = new StudentProfileModel(data)
        return await StudentProfile.save()
      }catch(error){
           throw new Error("Failed to create students profile")
      }
    }

    async getStudentProfileByID(id){
    if(!moongose.Types.ObjectId.isvaid(id)){
        throw new Error("Invalid student profile ID")
    }
    return StudentProfileModel.findById(id).
    populate("createdBy", "name email")
}

    async getAllStudentProfile(filter = {}){
          return StudentProfileModel.find(filter)
          .sort({ createdAt: -1 })
          .lean()
    }

  async updateStudentsProfile(id, studentsData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Student Id", 400);
    }

    return StudentProfileModel.findByIdAndUpdate(
      id,
      studentsData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();
  }

  async deleteStudentsProfile(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Student Id", 400);
    }

    return StudentProfileModel.findByIdAndDelete(id).lean();
  }
}

export default MongoStudent

