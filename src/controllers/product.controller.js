import { tryCatch } from "bullmq"
import productModel from "../models/products.model.js"
import productService from "../services/product.service.js"
class productController {
    constructor() {
        this.productservice = new productService()
    }
    createProduct = async (req, res, next) => {
        try {
            let productData = req.body
            console.log("your user data is -->", productData)
            let result = await this.productservice.createProduct(productData)
            return res.status(201).json({
                success: true,
                message: "product created successfully",
                data: result,
            })
        } catch (error) {
            console.log("error while creating products", error)
            next(error)
        }
    }

    getAllProducts = async (req, res, next) => {
        try {
            //service se data manga
            let data = await this.productservice.getAllProducts()
            //    this.productservice.getAllProducts() hai, wo Service class ka ek function (method) hai.
            // Jab aap this.productservice.getAllProducts() likhte hain, toh aap Controller se keh rahe
            //  hain: "Bhai, Service ke paas jao aur wahan se getAllProducts wala kaam karwa kar lao."
            return res.status(200).json({
                success: true,
                message: "products fetched successfully.",
                data
            })
        } catch (error) {
            console.log("error while fetching products", error)
            next(error)
        }
    }

    getSingleProduct = async (req, res, next) => {
        try {
            let id = req.params.id
            let product = await this.productservice.getSingleProduct(id)
            return res.status(200).json({
                success: true,
                message: "product fetched successfully",
                product
            })
        } catch (error) {
            console.log("error while creating products", error)
            next(error)
        }
    }

    updateProduct = async (req, res, next) => {
        try {
            let id = req.params.id
            let newData = req.body
            let updatedData = await this.productservice.updateProduct(id, newData)
            return res.status(200).json({
                success: true,
                message: "product updated successfully",
                updatedData
            })
        } catch (error) {
            console.log("error while creating products", error)
            next(error)
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            let id = req.params.id
            let deletedProduct = await this.productservice.deleteProduct(id)
            return res.status(200).json({
                success: true,
                message: "product deleted successfully",
                deletedProduct
            })
        } catch (error) {
            console.log("error while creating products", error)
            next(error)
        }
    }
}

export default new productController()