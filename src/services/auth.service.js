// src/services/auth.service.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/environment.js";
import verifyGoogleIdToken from "../utils/verifyGoogleToken.js";
import MongoUserRepository from "../repositories/implementations/mongoUserRepository.js";



class AuthService {
  constructor() {
    this.userRepository = new MongoUserRepository();
  }
  async getUserWithPermissions(userId) {
    try {
      const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

      if (!objectId) {
        throw new Error('Invalid userId provided');
      }
      const user = await User.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role"
          }
        },
        { $unwind: "$role" },
        {
          $lookup: {
            from: "permissions",
            localField: "role._id",
            foreignField: "roleId",
            as: "permissions"
          }
        },
        {
          $project: {
            email: 1,
            firstName: 1,
            lastName: 1,
            role: "$role.name",
            permissions: {
              $map: {
                input: "$permissions",
                as: "perm",
                in: {
                  resource: "$$perm.resource",
                  action: "$$perm.action"
                }
              }
            }
          }
        }
      ]);

      return user[0];

    } catch (error) {
      throw new Error('Error fetching user with permissions');
    }
  }

  async hasPermission(userId, roleName) {
    try {

      // 1. Validate userId
      const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

      if (!objectId) {
        throw new Error('Invalid userId provided');
      }

      // 2. Validate and normalize roleName
      if (!roleName || typeof roleName !== 'string') {
        throw new Error('Role name is required and must be a string');
      }
      const normalizedRole = roleName.trim().toLowerCase();

      // 3. Aggregate: Match user → lookup role → compare name
      const result = await User.aggregate([
        { $match: { _id: objectId } },

        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role"
          }
        },

        { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },

        {
          $project: {
            hasPermission: {
              $cond: [
                { $eq: [{ $toLower: "$role.name" }, normalizedRole] },
                true,
                false
              ]
            }
          }
        }
      ]);

      console.log(result[0]?.hasPermission)

      return result[0]?.hasPermission || false;

    } catch (error) {
      console.error('Error in hasPermission (role check):', error);
      throw new Error(`Error checking role: ${error.message}`);
    }
  }


  generateToken(userId, roleId) {
    return jwt.sign({ userId, roleId }, config.JWT_SECRET, { expiresIn: "24h" });
  }

  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }
}

export default AuthService;
