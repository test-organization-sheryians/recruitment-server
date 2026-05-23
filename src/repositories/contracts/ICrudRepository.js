
class ICrudRepository {

    async createData (){
        throw new Error("Must be Implemented.")
    }
    async readData (){
        throw new Error("Must be Implemented.")
    }
    async updateData (){
        throw new Error("Must be Implemented.")
    }
    async deleteData (){
        throw new Error("Must be Implemented.")
    }
}

export default ICrudRepository;