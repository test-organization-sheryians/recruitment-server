import MongoCrudRepository from "../repositories/implementations/mongoCrudRepository.js";

class CrudService {
    constructor() {
        this.repository = new MongoCrudRepository();
    }

    async create(data) {
        console.log(data);
        return await this.repository.createData(data);
    }

    async getAll(query, options) {
        return await this.repository.readData(query, options);
    }

    async update(id, data) {
        return await this.repository.updateData(id, data);
    }

    async delete(id) {
        return await this.repository.deleteData(id);
    }
}

export default new CrudService();
