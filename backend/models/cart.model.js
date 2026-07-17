import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    quantity : {
        type : Number,
        required : true,
        default : 1
    }
}, { timestamps: true })

cartSchema.index({ user: 1, product: 1 }, { unique: true });

const Cart = mongoose.model('Cart',cartSchema)

export default Cart
