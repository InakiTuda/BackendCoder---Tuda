import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import {__dirname} from "./utils.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
// import FileStore from "session-file-store";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";

const app = express();
const PORT = 8080;
// const fileStorage = FileStore(session);
const connection = mongoose.connect("mongodb+srv://inakituda:123456ituda@cluster0.pbsxdwh.mongodb.net/Desafio5?retryWrites=true&w=majority");

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));

app.use(session({
    // store: new fileStorage({path: `${__dirname}/sessions`, ttl: 15, retries: 0}),
    store: new MongoStore({
        mongoUrl: "mongodb+srv://inakituda:123456ituda@cluster0.pbsxdwh.mongodb.net/Desafio5?retryWrites=true&w=majority",
        ttl: 3600,
    }),
    secret: "CoderBackendTuda",
    resave: false,
    saveUninitialized: false,
}));

app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})