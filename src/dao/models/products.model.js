import mongoose from "mongoose";

const productsCollection = 'products';

const stringTypeSchemaRequired = {
    type: String,
    required: true
};

const numberTypeSchemaRequired = {
    type: Number,
    required: true
}

const productsSchema = new mongoose.Schema({
    id: Number,
    title: stringTypeSchemaRequired,
    description: stringTypeSchemaRequired,
    code: stringTypeSchemaRequired,
    price: numberTypeSchemaRequired,
    stock: numberTypeSchemaRequired,
    category: stringTypeSchemaRequired,
    thumbnail: {
        type:Array,
        default:[]
    },
    status: {
        type: Boolean,
        default: true
    }
})

export const productsModel = mongoose.model(productsCollection, productsSchema)