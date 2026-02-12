import MongoClientRepository from "../repositories/implementations/MongoClientRepository.js";
import mongoose from 'mongoose'
import { AppError } from "../utils/errors.js";

class ClientService {
    constructor() {
        this.repository = new MongoClientRepository()
    }

    async registerClient(clientdata) {
        const client = await this.repository.registerClient(clientdata)
        return client
    }

    async getAllClients() {
        const allClients = await this.repository.getAllClients()
        return allClients
    }

    async getSingleClient(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid client ID', 400)
        }
        const client = await this.repository.getSingleClient(id)
        if (!client) {
            throw new AppError('client not found', 404)
        }
        return client
    }

    async deleteClient(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid client ID', 400)
        }
        let deleted = await this.repository.deleteClient(id)
        if (!deleted) {
            throw new AppError('Client not found', 404)
        }
        return deleted
    }

    async updateClient(id, data) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid client ID', 400)
        }
        let updatedClient = await this.repository.updateClient(id, data)
        if (!updatedClient) {
            throw new AppError('client not found', 404)
        }
        return updatedClient
    }
}

export default ClientService