import ProductService from "../services/productService.js";

class ProductController {
	constructor() {
		this.productService = new ProductService();
	}

	
	createProduct = async (req, res) => {
		try {
			const result = await this.productService.createProduct(req.body);

			res.status(201).json({
				success: true,
				message: "Product created successfully",
				data: result,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	};

	
	getAllProducts = async (req, res) => {
		try {
			const result = await this.productService.getAllProducts();

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	};

	
	getProductById = async (req, res) => {
		try {
			const { id } = req.params;

			const result = await this.productService.getProductById(id);

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			res.status(404).json({
				success: false,
				error: error.message,
			});
		}
	};

	
	updateProduct = async (req, res) => {
		try {
			const { id } = req.params;

			const result = await this.productService.updateProduct(id, req.body);

			res.status(200).json({
				success: true,
				message: "Product updated successfully",
				data: result,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	};

	
	deleteProduct = async (req, res) => {
		try {
			const { id } = req.params;

			await this.productService.deleteProduct(id);

			res.status(200).json({
				success: true,
				message: "Product deleted successfully",
			});
		} catch (error) {
			res.status(404).json({
				success: false,
				error: error.message,
			});
		}
	};
}

export default ProductController;
