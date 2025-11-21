import mongoose from "mongoose";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import config from "../config/environment.js";
import bcrypt from "bcryptjs";

export const seedUsers = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Get roles
    const adminRole = await Role.findOne({ name: "admin" });
    const clientRole = await Role.findOne({ name: "client" });
    const candidateRole = await Role.findOne({ name: "candidate" });

    if (!adminRole || !clientRole || !candidateRole) {
      throw new Error("Roles not found. Please seed roles first using: npm run seed:roles");
    }

    // Create sample users
    const users = [
      {
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        firstName: "Admin",
        lastName: "User",
        roleId: adminRole._id
      },
      {
        email: "client@example.com",
        password: await bcrypt.hash("client123", 10),
        firstName: "Client",
        lastName: "User",
        roleId: clientRole._id
      },
      {
        email: "candidate@example.com",
        password: await bcrypt.hash("candidate123", 10),
        firstName: "Candidate",
        lastName: "User",
        roleId: candidateRole._id
      }
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully:", users.length);
    console.log("\nTest Credentials:");
    console.log("================");
    console.log("Admin:");
    console.log("  Email: admin@example.com");
    console.log("  Password: admin123");
    console.log("\nClient:");
    console.log("  Email: client@example.com");
    console.log("  Password: client123");
    console.log("\nCandidate:");
    console.log("  Email: candidate@example.com");
    console.log("  Password: candidate123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding users failed:", error.message);
    process.exit(1);
  }
};

seedUsers();
