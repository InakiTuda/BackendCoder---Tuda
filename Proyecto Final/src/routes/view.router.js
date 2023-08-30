import {Router} from "express";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";

const pm = new ProductManager();
const routerV = Router()

routerV.get("/", async (req, res) => {
    const listaProducts = await pm.getProductsView();
    res.render("home", {listaProducts});
});

routerV.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
});

routerV.get("/chat", (req, res) => {
    res.render("chat");
});

export default routerV;