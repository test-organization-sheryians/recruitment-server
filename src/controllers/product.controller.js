import ProductService from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";

const productService = new ProductService(new MongoProductRepository());

export const createProduct = asyncHandler(async (req, res) => {
  const { title, price } = req.body;

  // ✅ Basic validation
  if (!title || !price) {
    throw new AppError("Title and price are required", 400);
  }

  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(204).send(); // ✅ no content
});
