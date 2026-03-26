import carController from "../controllers/car.controllers.js";
import express from "express";
import {
  createCarValidator,
  updateCarValidator,
} from "../middlewares/validators/car.validator.js";

const router = express.Router();

router.post("/create", createCarValidator, carController.createCar);

router.get("/get/:carId", carController.getCar);

router.get("/get-all", carController.getAllCars);

router.get("/title/:title", carController.getCarByTitle);

router.put(
  "/update/:carId",
  updateCarValidator,
  carController.updateCar
);

router.delete("/delete/:carId", carController.deleteCar);

export default router;
