import crudDataModel from "../../models/crudData.model.js";
import ICrudRepository from "../contracts/ICrudRepository.js";

class MongoCrudRepository extends ICrudRepository {

    async createData(data) {
        try {
            const result = await crudDataModel.create(data);
            return result;
        } catch (error) {
            throw new Error(`Error creating data: ${error.message}`);
        }
    }

    async readData() {
        try {
            const result = await crudDataModel.find();
            return result;
        } catch (error) {
            throw new Error(`Error reading data: ${error.message}`);
        }
    }


    async updateData(id, data) {
        try {
            const result = await crudDataModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            });
            return result;
        } catch (error) {
            throw new Error(`Error updating data: ${error.message}`);
        }
    }

    async deleteData(id) {
        try {
            const result = await crudDataModel.findByIdAndDelete(id);
            return result;
        } catch (error) {
            throw new Error(`Error deleting data: ${error.message}`);
        }
    }

}

export default MongoCrudRepository;