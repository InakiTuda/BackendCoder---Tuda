import express from "express";
import viewRouter from "./routes/view.router.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";

const app = express();
const PORT = 8080;
console.log(__dirname);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname+"/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname+"/views");

app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/", viewRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})

const socketServer = new Server(httpServer);

import ProductManager from "./controllers/ProductManager.js";
const pManagerSocket = new ProductManager(__dirname+"/files/products.json");

socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado con ID:", socket.id);
    const listaProducts = await pManagerSocket.getProducts({});
    socketServer.emit("productsSend", listaProducts);

    socket.on("addProduct", async (obj) => {
    await pManagerSocket.addProducts(obj)
    const listaProducts = await pManagerSocket.getProducts({});
    socketServer.emit("productsSend", listaProducts);
    })


    socket.on("deleteProduct", async (id) => {
    await pManagerSocket.deleteProducts(id);
    const listaProducts = await pManagerSocket.getProducts({});
    socketServer.emit("productsSend", listaProducts);
    })
})
