import ProductService from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = asyncHandler(async (req, res) => {
    const reqData = req.body;

    const product = await this.productService.createProduct(reqData);

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  });

  getProducts = asyncHandler(async (req, res) => {
    const reqData = req.body;

    const products = await this.productService.getAllProducts(reqData);

    res.status(200).json({
      success: true,
      data: products,
    });
  });

  getProductById = asyncHandler(async (req, res) => {
    const reqParamsId = req.params.id;

    const product = await this.productService.getProductById(reqParamsId);

    res.status(200).json({
      success: true,
      data: product,
    });
  });

  updateProduct = asyncHandler(async (req, res) => {
    const reqData = req.body;
    const reqParamsId = req.params.id;

    const updated = await this.productService.updateProduct(
      reqParamsId,
      reqData,
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Product updated successfully",
    });
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const reqParamsId = req.params.id;

    await this.productService.deleteProduct(reqParamsId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  });
}

export default ProductController;
