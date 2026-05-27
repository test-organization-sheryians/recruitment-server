import ProductService from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const productService = new ProductService();

class ProductController {
    createProduct = asyncHandler(async (req, res, next) => {
        const product = await productService.createProduct(req.body);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    });

    getAllProducts = asyncHandler(async (req, res, next) => {
        const products = await productService.getAllProducts(req.query);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    });

    getProductById = asyncHandler(async (req, res, next) => {
        const product = await productService.getSingleProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    });

    getProductsByCategory = asyncHandler(async (req, res, next) => {
        const products = await productService.getProductsByCategory(req.params.categoryId);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    });

    updateProduct = asyncHandler(async (req, res, next) => {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    });

    deleteProduct = asyncHandler(async (req, res, next) => {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    });
}

export default new ProductController();
