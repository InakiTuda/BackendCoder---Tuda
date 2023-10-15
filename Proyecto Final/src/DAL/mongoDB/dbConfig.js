import mongoose from "mongoose";
import config from "../../config.js";

const URI = config.mongo_uri;
mongoose
    .connect(URI)
    .then(() => console.log("Conectado a la Base de Datos"))
    .catch((error) => console.log(error))