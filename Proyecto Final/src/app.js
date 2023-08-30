import express from "express";
import routerV from "./routes/view.router.js";
import routerP from "./routes/products.router.js";
import routerC from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import connectToDB from "./config/dbConfig.js";
import socketProducts from "./listeners/socketProducts.js";
import socketChat from "./listeners/socketChat.js";

const app = express();
const PORT = process.env.PORT||8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname+"/views");

app.use("/api/products", routerP);
app.use("/api/carts", routerC);
app.use("/", routerV);

connectToDB()

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Escuchando al puerto ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/api/products`);
        console.log(`\t2). http://localhost:${PORT}/api/carts`);
    } catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer);

const mensajes = [];

socketProducts(socketServer);
socketChat(socketServer);
