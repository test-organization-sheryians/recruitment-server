import mongoose from "mongoose";
import IUserRepository from "../contracts/IUserRepository.js";
import User from "../../models/user.model.js";
import { AppError } from "../../utils/errors.js";

class MongoUserRepository extends IUserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      const saveUser = await user.save();
      return saveUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new AppError(`Failed to create user: ${error.message}`, 500, error);
    }
  }

  async findUserByEmail(email) {
    try {
      const [user] = await User.aggregate([
        {
          $match: { email: email },
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
          $lookup: {
            from: "permissions",
            localField: "role._id",
            foreignField: "roleId",
            as: "permissions",
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
            isVerified:1,
            role: {
              _id: "$role._id",
              name: "$role.name",
              description: "$role.description",
            },
          },
        },
        { $limit: 1 },
      ]);
      console.log(user , "this is from the UserRepo")
      return user || null;
    } catch (error) {
      throw new AppError(
        "Failed to find user with role and permissions",
        500,
        error
      );
    }
  }

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


async findUserById(id) {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    console.log("ERROR: Invalid ObjectId format:", id);
    return null;
  }

  const objectId = new mongoose.Types.ObjectId(id);

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
  { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
      role: {
        $cond: [
          { $ifNull: ["$role", false] },
          { _id: "$role._id", name: "$role.name" },
          null,
        ],
      },
    },
  },
  { $limit: 1 },
]);


  return user || null;
}

   async updateUser(userId, updateObj) {
    return await User.findByIdAndUpdate(userId, updateObj, { new: true });
  }

  // Get user by ID, optionally populate role
  async getUserById(userId, populateRole = false) {
    let query = User.findById(userId);
    if (populateRole) {
      query = query.populate("roleId"); // populate role reference
    }
    return await query;
  }
}

export default MongoUserRepository;
