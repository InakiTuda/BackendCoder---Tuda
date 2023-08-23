import mongoose from "mongoose";

const URI="mongodb+srv://inakituda:123456ituda@cluster0.pbsxdwh.mongodb.net/ecommerce?retryWrites=true&w=majority";

await mongoose.connect(URI, {
    serverSelectionTimeoutMS: 5000,
});
console.log("Conectado a la Base de Datos")