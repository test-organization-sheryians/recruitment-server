import ITokenRepository from "../contracts/ITokenRepository.js";
import User from "../../models/user.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";


class MongoTokenRepository extends ITokenRepository{
    async createToken (userId){
        const id = userId
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      console.log("ERROR: Invalid ObjectId format:", id);
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(id);

    try {
      const [user] = await User.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $unwind: {
            path: "$role",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            email: 1,
            password: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            googleId: 1,
            isVerified: 1,
            role: {
              $cond: [
                { $ifNull: ["$role", false] },
                {
                  _id: "$role._id",
                  name: "$role.name",
                  description: "$role.description", // kept full description like in HEAD
                },
                null,
              ],
            },
          },
        },
        { $limit: 1 },
      ]);

      return user || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new AppError("Failed to find user by ID", 500, error);
    }
  }
    
}

export default MongoTokenRepository