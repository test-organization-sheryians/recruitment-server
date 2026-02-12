import mongoose from 'mongoose'
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    website: {
        type: String,
    },
    sector: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    description: {
        type: String
    }
}, {
    timestamps: true
})

export default mongoose.model('client', clientSchema)