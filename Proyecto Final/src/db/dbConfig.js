import mongoose from "mongoose";

const URI="mongodb+srv://inakituda:123456ituda@cluster0.pbsxdwh.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose.connect(URI)
.then(() => console.log("Conectado a la Base de Datos"))
.catch((error) => {
    console.log("Error al conectar a la Base de Datos", error);
})