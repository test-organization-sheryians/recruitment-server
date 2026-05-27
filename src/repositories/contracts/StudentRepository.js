class StudentProfile {
    async StudentProfilecreate(data) {
        throw new Error("Student profile is not created")
    }
    async getAllStudentProfile(filter = {}) {
        throw new Error("unable to find Student data")
    }

    async getStudentProfileByID(id) {
        throw new Error("unable to find Student data by this id")
    }

    async deleteStudentsProfile(id) {
        throw new Error("unable to delete ");
    }
    async updateStudentsProfile(id, studentsData) {
        throw new Error("unable to update ");
    }

}

export default StudentProfile