class BlogPostRepository {
  async create(data) {
    throw new Error('Method not implemented.');
  }

  async findPaginated(filter, skip, limit) {
    throw new Error('Method not implemented.');
  }

  async searchBlogs(filters, options) {
    throw new Error('Method not implemented.');
  }

  async count(filter) {
    throw new Error('Method not implemented.');
  }

  async findById(id) {
    throw new Error('Method not implemented.');
  }

  async findBySlug(slug) {
    throw new Error('Method not implemented.');
  }

  async getTopViewedBlogs(){
    throw new Error("Method not implemented");
  }

  async updateById(id, data) {
    throw new Error('Method not implemented.');
  }

  async deleteById(id) {
    throw new Error('Method not implemented.');
  }
}

export default BlogPostRepository;