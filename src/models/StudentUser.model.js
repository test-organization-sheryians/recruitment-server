import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        age: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const StudentUser = mongoose.model("StudentUser", userSchema);

export default StudentUser;