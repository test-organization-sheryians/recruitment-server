import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    content:{
        type: String,
        required: [true, "Content is required"]
    }
})

const Message = mongoose.model("Message", messageSchema);

export default Message;