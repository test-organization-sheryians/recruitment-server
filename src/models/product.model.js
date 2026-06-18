import mongoose from 'mongoose';
// af0dec5
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        default: 'No image available',
        required: [true, 'Image is required']
    },
    price: {
        amount: {
            type: Number,
            required: [true, 'Price amount is required']
        },
        currency: {
            type: String,
            enum: ['INR', 'USD'],
            required: [true, 'Price currency is required']
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    }
});

const ProductModel = mongoose.model('ProductStore', productSchema);
export default ProductModel;