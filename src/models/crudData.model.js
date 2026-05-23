import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const crudSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("Crud", crudSchema);