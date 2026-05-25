import productModel from "../../models/products.model.js";
import { AppError } from "../../utils/errors.js";
import IProductsRepository from "../contracts/IProductsRepository.js";

class mongoProductRepository extends IProductsRepository {
    async createProduct(productData) {
        try {
            //check krte hai ki phle se exist to nhi karta product name ki help se karta to create nhi karege dobara 
            let product = new productModel(productData)
            let savedProduct = await product.save()
            return savedProduct
        } catch (error) {
            console.log("error while creating products", error)
            throw new AppError(`error while creating products : ${error.message}`, 500, error)
        }
    }

    async getAllProducts(productName) {
        try {
            let products = await productModel.find(productName)
            return products
        }
        catch (error) {
            console.log("error while fetching products", error)
            throw new AppError(`error while fetching products : ${error.message}`, 500, error)
        }
    }

    async getSingleProduct() {
        try {
            let product = await productModel.findOne()
            return product
        }
        catch (error) {
            console.log("error while fetching product", error)
            throw new AppError(`error while fetching product : ${error.message}`, 500, error)
        }
    }

    async getSingleProduct(id) {
        try {
            let singleProduct = await productModel.findById(id)
            return singleProduct
        }
        catch (error) {
            console.log("error while fetching products", error)
            throw new AppError(`error while fetching products : ${error.message}`, 500, error)
        }
    }

    async updateProduct(id, newData) {
        try {
            let updatedProduct = await productModel.findByIdAndUpdate(id, newData, {
                new: true,
                runValidators: true,
            })
            return updatedProduct
        }
        catch (error) {
            console.log("error while updating products", error)
            throw new AppError(`error while updating products : ${error.message}`, 500, error)
        }
    }

    async deleteProducts(id) {
        try {
            let deletedProduct = await productModel.findByIdAndDelete(id)
            return deletedProduct
        }
        catch (error) {
            console.log("error while deleting products", error)
            throw new AppError(`error while deleting products : ${error.message}`, 500, error)
        }
    }
}
export default mongoProductRepository