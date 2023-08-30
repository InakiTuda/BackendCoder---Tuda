import mongoose from "mongoose";

const URI="mongodb+srv://inakituda:123456ituda@cluster0.pbsxdwh.mongodb.net/ecommerce?retryWrites=true&w=majority";

const connectToDB = () => {
    try {
        mongoose.connect(URI)
        console.log("Conectado a la Base de Datos")
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;