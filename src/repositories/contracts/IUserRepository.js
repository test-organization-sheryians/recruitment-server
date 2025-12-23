class IUserRepository {
  async createUser(userData) {
    throw new Error("Method not implemented");
  }

  async findUserByEmail(email) {
    throw new Error("Method not implemented");
  }

  async findUserById(id) {
    throw new Error("Method not implemented");
  }

  async updateUser(id, userData) {
    throw new Error("Method not implemented");
  }
  async findUser(query){
     throw new Error("Method not implemented");
  }
  async findByResetToken(token){
    throw new Error("Method not implemented");
  }
  async updateResetToken(id,token,expires){
    throw new Error("Method not implemented");
  }
  async clearResetToken(id){
    throw new Error("Method not implemented");
  }
}

export default IUserRepository;
