
import ProductService from "../services/product.Service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ProductController{

   constructor(){
    this.productService = new  ProductService();
   }

         createdProduct =asyncHandler (async(req, res)=>{
            const product = await this.productService.createdProduct(req.body);
            res.status(201).json({ success:true, data:product})
            console.log(product)
         })

    getProductById = (async(req,res)=>{
        const product = await this.productService.getProductById(req.params.id);
         res.status(200).json({ success:true, data:product})
    })

    getAllProduct = (async(req,res)=>{
        const product = await this.productService.getAllProduct();
        res.status(200).json({ success: true, data: product });
    })

    updateProduct = (async(req,res)=>{
        const product = await this.productService.updateProduct(
       req.params.id,
       req.body
        );
         res.status(200).json({ success: true, data: product });
    })

   deletProduct = (async(req,res)=>{
   await this.productService.deletProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
   })

}

export default ProductController;