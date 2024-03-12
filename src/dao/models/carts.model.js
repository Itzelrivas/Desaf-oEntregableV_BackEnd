import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    products: {
        type:[{
            product: Number,
            quantity: Number
        }],
        default:[]
    }
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)