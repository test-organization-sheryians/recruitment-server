import { tryCatch } from "bullmq";
import productservice from "../services/product.service.js";

class productcontroller {
  constructor() {
    this.productservice = new productservice();
  }

  createProduct = async (req, res, next) => {
    try {
      let productData = req.body;
      let result = await this.productservice.createProduct(productData);
      return res.status(201).json({
        success: true,
        message: "product created successfully",
        data: result,
      });
    } catch (error) {
      console.log("error while creating product", error);
      next(error);
    }
  };
  getAllproduct = async (req, res, next) => {
    try {
      let products = await this.productservice.getallProduct();
      return res.status(200).json({
        message: "products fetched successfully.",
        success: true,
        products,
      });
    } catch (error) {
      console.log("error while fetching products", error);
      next(error);
    }
  };
  getSingleproduct = async (req, res, next) => {
    try {
      let id = req.params.id;
      let product = await this.productservice.getsingleProuct(id);
      res.status(200).json({
        success: true,
        message: "product fetched successfully",
        product,
      });
    } catch (error) {
      console.log("error while fetching products", error);
      next(error);
    }
  };
  updateProduct = async (req, res, next) => {
    try {
      let id = req.params.id;
      let data = req.body;
      let updatedproduct = await this.productservice.updateProduct(id, data);
      return res.status(200).json({
        success: true,
        message: "product updated successfully",
        updatedData,
      });
    } catch (error) {
      console.log("error while creating products", error);
      next(error);
    }
  };
  deleteProdcut = async (req, res, next) => {
    try {
      let id = req.params.id;
      let deleteProdcut = this.productservice.deleteProduct(id);
      return res.status(200).json({
        success: true,
        message: "product deleted successfully",
        deleteProdcut,
      });
    } catch (error) {
      console.log("error while creating products", error);
      next(error);
    }
  };
}

export default new productcontroller();
