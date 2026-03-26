import MongoCarRepository from "../repositories/implementations/mongoCarRepository.js";
import { AppError } from "../utils/errors.js";

class CarService {
  constructor() {
    this.CarRepository = new MongoCarRepository();
  }

  // create car
  async CreateCar(carData) {
    const car = await this.CarRepository.createCar(carData);
    if (!car) {
      throw new AppError("Failed to create car", 500);
    }
    return car;
  }

  //Get a Car by id
  async GetCarById(carId) {
    const car = await this.CarRepository.findCarById(carId);
    if (!car) {
      throw new AppError("Car not found ", 404);
    }
    return car;
  }

  //Fetching all Cars
  async GetAllCars() {
    const cars = await this.CarRepository.findAllCars();
    return cars || [];
  }

  //geting car by Title
  async GetCarByTitle(title) {
    const car = await this.CarRepository.findCarByTitle(title);
    if (!car) throw new AppError("Car not found", 404);
    return car;
  }

  //updating the Car Data
  async UpdateCar(carId, updateData) {
    const updatedCar = await this.CarRepository.updateCar(carId, updateData);
    if (!updatedCar) throw new AppError("Car not found ", 404);
    return updatedCar;
  }

  //deleting the Car
  async DeleteCar(carId) {
    const deletedCar = await this.CarRepository.deleteCar(carId);
    if (!deletedCar) throw new AppError("Car not found", 404);
    return deletedCar;
  }
}

export default CarService;
