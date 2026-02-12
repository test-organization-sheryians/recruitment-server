import IClientRepository from '../contracts/IClientRepository.js'
import Client from '../../models/client.model.js'

class MongoClientRepository extends IClientRepository {

    async registerClient(clientdata) {
        return await Client.create(clientdata)
    }

    async getAllClients() {
        return await Client.find()
    }

    async getSingleClient(id) {
        return await Client.findById(id)
    }

    async deleteClient(id) {
        return await Client.findByIdAndDelete(id)
    }

    async updateClient(id, data) {
        return await Client.findByIdAndUpdate(
            id,
            data,
            { new: true}
        )
    }
}


export default MongoClientRepository