import mongoose from "mongoose";

const userCollection = "user";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts",
    },
    role: {
        type: String,
        default: "USER",
    },
    fromGithub: {
        type: Boolean,
        default: false,
    },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;