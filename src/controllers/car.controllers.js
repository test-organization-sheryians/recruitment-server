import CarService from "../services/car.service.js";
import { AppError } from "../utils/errors.js";

class CarController {
  constructor() {
    this.carService = new CarService();

    // Bind all methods
    this.createCar = this.createCar.bind(this);
    this.getCar = this.getCar.bind(this);
    this.getAllCars = this.getAllCars.bind(this);
    this.getCarByTitle = this.getCarByTitle.bind(this);
    this.updateCar = this.updateCar.bind(this);
    this.deleteCar = this.deleteCar.bind(this);
  }

  // Create Car
  async createCar(req, res, next) {
    try {
      const carData = req.body;
    //   console.log(carData);

      const car = await this.carService.CreateCar(carData);

      return res.status(201).json({
        success: true,
        message: "Car created successfully",
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Car by ID
  async getCar(req, res, next) {
    try {
      const { carId } = req.params;

      const car = await this.carService.GetCarById(carId);

      return res.status(200).json({
        success: true,
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Cars
  async getAllCars(req, res, next) {
    try {
      const cars = await this.carService.GetAllCars();

      return res.status(200).json({
        success: true,
        count: cars.length,
        data: cars,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Car by Title
  async getCarByTitle(req, res, next) {
    try {
      const { title } = req.params;

      const car = await this.carService.GetCarByTitle(title);

      return res.status(200).json({
        success: true,
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Car
  async updateCar(req, res, next) {
    try {
      const { carId } = req.params;
      const updateData = req.body;

      const updatedCar = await this.carService.UpdateCar(
        carId,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Car updated successfully",
        data: updatedCar,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete Car
  async deleteCar(req, res, next) {
    try {
      const { carId } = req.params;

      await this.carService.DeleteCar(carId);

      return res.status(200).json({
        success: true,
        message: "Car deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CarController();
