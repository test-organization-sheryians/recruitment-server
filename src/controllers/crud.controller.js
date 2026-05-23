import CrudService from "../services/crud.service.js";

class CrudController {

    // constructor() {
    //     CrudService = new CrudService();
    // }

    async create(req, res) {
        try {
            const result = await CrudService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Data created successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Read All
    async read(req, res) {
        try {
            const result = await CrudService.getAll();

            res.status(200).json({
                success: true,
                message: "Data retrieved successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Read By ID
    async readById(req, res) {
        try {
            const result = await CrudService.getById(req.params.id);
            res.status(200).json({
                success: true,
                message: "Data retrieved successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update
    async update(req, res) {
        try {
            const result = await CrudService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: "Data updated successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Delete
    async deleteData(req, res) {
        try {
            const result = await CrudService.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Data deleted successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new CrudController();
