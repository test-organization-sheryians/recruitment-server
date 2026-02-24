class ISavedBlogRepository {
  async save(data) {
    throw new Error("Method not implemented.");
  }

  async findPaginated(filter, skip, limit) {
    throw new Error("Method not implemented.");
  }

  async count(filter) {
    throw new Error("Method not implemented.");
  }

  async delete(filter) {
    throw new Error("Method not implemented.");
  }

  async findOne(filter) {
    throw new Error("Method not implemented.");
  }
}

export default ISavedBlogRepository;