import mongoose from "mongoose";
import Role from "../models/role.model.js";
import config from "../config/environment.js";

const roles = [
  { name: "admin", description: "System administrator with full access" },
  { name: "client", description: "Company recruiter with job posting privileges" },
  { name: "candidate", description: "Job seeker with basic access" }
];

export const seedRoles = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing roles
    await Role.deleteMany({});
    console.log("Cleared existing roles");

    // Create roles
    const createdRoles = await Role.insertMany(roles);
    console.log("Roles seeded successfully:", createdRoles.length);
    process.exit(0);
  } catch (error) {
    console.error("Seeding roles failed:", error.message);
    process.exit(1);
  }
};

seedRoles();
