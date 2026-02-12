import ClientService from "../services/client.services.js";

class ClientController {
    constructor() {
        this.service = new ClientService()
    }

    register = async (req, res) => {
        try {
            const clientdata = req.body
            let client = await this.service.registerClient(clientdata)

            return res.status(201).json({
                success: true,
                message: 'Client Registered',
                data: client
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            })
        }
    }

    getSingleClient = async (req, res) => {
        try {
            const { id } = req.params
            let client = await this.service.getSingleClient(id)

            return res.status(200).json({
                success: true,
                message: 'Client fetched',
                data: client
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            })
        }
    }
    getAllClients = async (req, res) => {
        try {

            let allClients = await this.service.getAllClients()

            return res.status(200).json({
                success: true,
                message: 'All clients are fetched',
                data: allClients
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            })
        }
    }

    deleteClient = async (req, res) => {
        try {
            const { id } = req.params
            await this.service.deleteClient(id)

            return res.status(200).json({
                success: true,
                message: 'Client deleted',
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            })
        }
    }

    updateClient = async (req, res) => {
        try {
            const clientdata = req.body
            const { id } = req.params
            let updatedClient = await this.service.updateClient(id, clientdata)

            return res.status(200).json({
                success: true,
                message: 'Client updated',
                data: updatedClient
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export default new ClientController()