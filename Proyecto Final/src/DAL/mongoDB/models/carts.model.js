import mongoose from 'mongoose';

const cartCollection = 'Carts';

const cartSchema = new mongoose.Schema({
    products: {
        type:[
            {
                _id:{
                    type: mongoose.Types.ObjectId,
                    ref: 'Products'
                },
                quantity:{
                    type: Number,
                    default:1
                }  
            }
        ],
        default:[]
    }
});

cartSchema.pre("find", function(next) {
    this.populate("products._id");
    next();
})

export const cartModel = mongoose.model(cartCollection, cartSchema)

