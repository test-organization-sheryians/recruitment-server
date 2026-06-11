import ProductService from "../services/product.service.js";

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    createProduct = async (req, res, next) => {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    };

    getProductById = async (req, res, next) => {
        try {
            const product = await this.productService.getProductById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    };

    updateProduct = async (req, res, next) => {
        try {
            const updatedProduct = await this.productService.updateProduct(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            await this.productService.deleteProduct(req.params.id);
            res.status(204).json({ message: "Product deleted successfully" });
        } catch (error) {
            next(error);
        }
    }   }

export default new ProductController();