import express from "express";
import routerV from "./routes/view.router.js";
import routerP from "./routes/products.router.js";
import routerC from "./routes/carts.router.js";
import routerS from "./routes/sessions.router.js";
import routerJ from "./routes/jwt.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import "../src/config/dbConfig.js";
import cookieParser from "cookie-parser";
import socketProducts from "./listeners/socketProducts.js";
import socketChat from "./listeners/socketChat.js";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./passport/passportStrategies.js";

const app = express();
const PORT = process.env.PORT||8080;
const fileStore = FileStore(session)

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Sessions
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://inakituda:123456ituda@cluster0.pbsxdwh.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 60000,
   }),
    secret: "BackendCoderTuda",
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(__dirname+"/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname+"/views");

app.use("/api/views", routerV);
app.use("/api/products", routerP);
app.use("/api/views/products", routerP);
app.use("/api/carts", routerC);
app.use("/api/session", routerS);
app.use("/api/jwt", routerJ);

app.get('/', (req, res) => {
    res.send('Bienvenidos');
});

app.get('/chat', (req, res) => {
    res.render('chat', { messages: [] }); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});
  
app.get('/register', (req, res) => {
    res.render('register'); 
});
  
app.get('/profile', (req, res) => {
    res.render('profile', {
    user: req.session.user,
    }); 
});
  
// Passport
app.use(passport.initialize())
app.use(passport.session())

const httpServer = app.listen(PORT, () => {
        console.log(`Conectado al puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

const mensajes = [];

socketProducts(socketServer);
socketChat(socketServer);
