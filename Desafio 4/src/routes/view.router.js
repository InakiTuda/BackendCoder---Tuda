import {Router} from "express";
import ProductManager from "../dao/filemanagers/controllers/ProductManager.js";
import { __dirname } from "../utils.js";

const pManager = new ProductManager(__dirname+"/files/products.json");

const router = Router();

router.get("/", async (req, res) => {
    const listaProducts = await pManager.getProducts({})
    res.render("home", {listaProducts});
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
});

router.get("/chat", (req, res) => {
    res.render("chat")
});

export default router;