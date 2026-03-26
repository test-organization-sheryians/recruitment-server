import ICarRepository from "../contracts/ICarRepository.js";
import Car from "../../models/car_s.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoCarRepository extends ICarRepository {
  // create a car
  async createCar(carData) {
    try {
      const car = new Car(carData);
      const savedCar = await car.save();
      return savedCar;
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Car with this title already exists", 409);
      }
      throw new AppError(
        `Failed to create the car : ${error.message}`,
        500,
        error,
      );
    }
  }

  //searching car by carId
  async findCarById(carId) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new AppError("Invalid CarId ", 400);
    }
    try {
      return await Car.findById(carId).lean();
    } catch (error) {
      throw new AppError(`failed to find  car : ${error.message}`, 500, error);
    }
  }

  //fetching all cars
  async findAllCars() {
    try {
      return await Car.find().lean();
    } catch (error) {
      throw new AppError(
        `failed to fetch all cars : ${error.message}`,
        500,
        error,
      );
    }
  }
  //finding car by its title
  async findCarByTitle(title) {
    try {
      return await Car.findOne({ title }).lean();
    } catch (error) {
      throw new AppError(
        `failed to find the car via Title : ${error.message}`,
        500,
        error,
      );
    }
  }

  //Updating the carData
  async updateCar(carId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new AppError("Invalid CarId ", 400);
    }

    try {
      return await Car.findByIdAndUpdate(carId, updateData, {
        new: true,
        runValidators: true,
      }).lean();
    } catch (error) {
      throw new AppError(
        `Failed to update CarDetails : ${error.message}`,
        500,
        error,
      );
    }
  }

  //Deleting the car
  async deleteCar(carId) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new AppError(`Invalid CarId `, 400);
    }

    try {
      return await Car.findByIdAndDelete(carId).lean();
    } catch (error) {
      throw new AppError(`Failed to Delete Car: ${error.message}`, 500, error);
    }
  }
}

export default MongoCarRepository;
