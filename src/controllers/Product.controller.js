import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";

const productRepository = new MongoProductRepository();

export const createProduct = async (req,res,next) => {
    try {
        const product = await productRepository.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    }); 
    } catch (error) {
        next(error);
    }
}



export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


    export const updateProduct = async (req,res,next) => {
        try {
    const { id } = req.params;

    const updatedProduct = await productRepository.updateProduct(
      id,
      req.body
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
       } catch (error) {
         next(error);
       }
    };

    export const deleteProduct = async (req,res,next) => {
         try {
             const { id } = req.params;

            const deletedProduct = await productRepository.deleteProduct(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
      
    });
         } catch (error) {
            next(error);
         }
        }