import express from "express";
import viewRouter from "./routes/view.router.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import "./dao/dbConfig.js";

const app = express();
const PORT = process.env.PORT||8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname+"/views");

app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/", viewRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
});

const socketServer = new Server(httpServer);

const mensajes = []

import ProductManager from "./dao/mongomanagers/productManagerMongo.js";
const pManagerSocket = new ProductManager();

import MessagesManager from "./dao/mongomanagers/messageManagerMongo.js";
const messagesManager = new MessagesManager();

socketServer.on("connection", async(socket) => {
    console.log("Cliente conectado con ID:", socket.id)
    const listaDeProductos = await pManagerSocket.getProducts();
    socketServer.emit("enviodeproducts", listaDeProductos);

    socket.on("addProduct", async(obj) => {
        await pManagerSocket.addProduct(obj);
        const listaDeProductos = await pManagerSocket.getProducts();
        socketServer.emit("enviodeproducts", listaDeProductos);
    })

    socket.on("deleteProduct", async(id) => {
        console.log(id)
        await pManagerSocket.deleteProduct(id);
        const listaDeProductos = await pManagerSocket.getProducts({});
        socketServer.emit("enviodeproducts", listaDeProductos);
    })

    socket.on("nuevousuario", (usuario) => {
        console.log("usuario", usuario);
        socket.broadcast.emit("broadcast", usuario);
    })
        socket.on("disconnect", () => {
            console.log(`Usuario con ID: ${socket.id} se desconectó`);
        })

        socket.on("mensaje", info => {
            mensajes.push(info)
            socketServer.emit("chat", mensajes)
        })

        socket.on("mensaje", async(info) => {
            // Guardar Mensajes
            console.log(info);
            await messagesManager.createMessage(info);
            // Enviar Mensaje a todos los clientes
            socketServer.emit("chat", await messagesManager.getMessages());
        });

})