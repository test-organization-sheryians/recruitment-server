import mongoose from "mongoose";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import config from "../config/environment.js";

const permissions = [
  // Admin permissions
  { resource: "users", action: "manage" },
  { resource: "jobs", action: "manage" },
  { resource: "applications", action: "manage" },
  
  // Client permissions
  { resource: "jobs", action: "create" },
  { resource: "jobs", action: "update" },
  { resource: "applications", action: "read" },
  
  // Candidate permissions
  { resource: "jobs", action: "read" },
  { resource: "applications", action: "create" },
  { resource: "profile", action: "update" }
];

export const seedPermissions = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing permissions
    await Permission.deleteMany({});
    console.log("Cleared existing permissions");

    // Get roles
    const adminRole = await Role.findOne({ name: "admin" });
    const clientRole = await Role.findOne({ name: "client" });
    const candidateRole = await Role.findOne({ name: "candidate" });

    if (!adminRole || !clientRole || !candidateRole) {
      throw new Error("Roles not found. Please seed roles first using: npm run seed:roles");
    }

    // Create permissions
    const permissionDocs = [];
    permissions.forEach((perm, index) => {
      let roleId;
      if (index < 3) roleId = adminRole._id;
      else if (index < 6) roleId = clientRole._id;
      else roleId = candidateRole._id;

      permissionDocs.push({
        ...perm,
        roleId
      });
    });
    
    
    await Permission.insertMany(permissionDocs);
    console.log("Permissions seeded successfully:", permissionDocs.length);
    process.exit(0);
  } catch (error) {
    console.error("Seeding permissions failed:", error.message);
    process.exit(1);
  }
};

seedPermissions();
