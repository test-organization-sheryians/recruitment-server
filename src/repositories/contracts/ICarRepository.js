class ICarRepository {
  async createCar(carData) {
    throw new Error("Method not implemented");
  }

  async findCarById(carId) {
    throw new Error("Method not implemented");
  }

  async findAllCars() {
    throw new Error("Method not implemented");
  }

  async findCarByTitle(title){
    throw new Error("Method not Implemented");
  }
  async updateCar(carId, updateData) {
    throw new Error("Method not implemented");
  }

  async deleteCar(carId) {
    throw new Error("Method not implemented");
  }
}

export default ICarRepository;
