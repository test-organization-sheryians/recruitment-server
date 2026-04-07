import mongoose from "mongoose";
import IUserRepository from "../contracts/IUserRepository.js";
import User from "../../models/user.model.js";
import { AppError } from "../../utils/errors.js";

class MongoUserRepository extends IUserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new AppError(`Failed to create user: ${error.message}`, 500, error);
    }
  }

  async findUserByEmail(email) {
    try {
      const [user] = await User.aggregate([
        { $match: { email } },
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
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            password: 1,
            googleId: 1,
            isVerified: 1,
            role: {
              _id: "$role._id",
              name: "$role.name",
              description: "$role.description",
            },
          },
        },
        { $limit: 1 },
      ]);

      return user || null;
    } catch (error) {
      throw new AppError("Failed to find user with role", 500, error);
    }
  }

  // New method from dev branch: Get all users with role info
  async findAllUsers() {
    try {
      const users = await User.aggregate([
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
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            googleId: 1,
            isVerified: 1,
            role: {
              _id: "$role._id",
              name: "$role.name",
              description: "$role.description",
            },
          },
        },
      ]);

      return users;
    } catch (error) {
      throw new AppError("Failed to fetch all users with roles", 500, error);
    }
  }

  // Improved findUserById (combining best from both branches)
  async findUserById(id) {
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

  async updateUser(userId, updateObj) {
    try {
      return await User.findByIdAndUpdate(userId, updateObj, { new: true });
    } catch (error) {
      throw new AppError("Failed to update user", 500, error);
    }
  }

  // Optional: populate role if needed (kept as is)
  async getUserById(userId, populateRole = false) {
    try {
      let query = User.findById(userId);
      if (populateRole) {
        query = query.populate("roleId");
      }
      return await query;
    } catch (error) {
      throw new AppError("Failed to get user by ID", 500, error);
    }
  }

  async findUser(query) {
    const searchQuery = query.trim();
    if (!searchQuery) return [];

    const regex = new RegExp(searchQuery, "i");

    try {
      const users = await User.aggregate([
        {
          $match: {
            $or: [
              { email: regex },
              { firstName: regex },
              { lastName: regex },
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$firstName", " ", "$lastName"] },
                    regex: searchQuery,
                    options: "i",
                  },
                },
              },
            ],
          },
        },
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
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            googleId: 1,
            isVerified: 1,
            role: {
              _id: "$role._id",
              name: "$role.name",
              description: "$role.description",
            },
            fullName: { $concat: ["$firstName", " ", "$lastName"] },
          },
        },
        { $limit: 20 },
      ]);

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      throw new AppError("Failed to search users", 500, error);
    }
  }
}

export default MongoUserRepository;
