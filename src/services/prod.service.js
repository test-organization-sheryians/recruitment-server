import productRepository from "../repositories/implementations/mongoProdRepository.js"
class prodService {
    constructor(productRepository){
        this.productRepository = productRepository
    }

    async createProd(data){
        return await this.productRepository.createProd(data)
    }

    async getAllProds(){
        return await this.productRepository.getAllProds()

    }
    async getProdById(id){
        return await this.productRepository.getProdById(id)
    }
    async updateProd(id, data){
        return await this.productRepository.updateProd(id, data)
    }
    async deleteProd(id){
        return await this.productRepository.deleteProd(id)
    }
}

export default prodService;