class IReviewRepository {
  async createReview(reviewData) {
    throw new Error("Method not implemented");
  }

  async findReviewById(id) {
    throw new Error("Method not implemented");
  }

  async findReviewsByUser(userId) {
    throw new Error("Method not implemented");
  }

  async updateReview(id, reviewData) {
    throw new Error("Method not implemented");
  }

  async deleteReview(id) {
    throw new Error("Method not implemented");
  }

  async getAverageRating(userId) {
    throw new Error("Method not implemented");
  }
}

export default IReviewRepository;