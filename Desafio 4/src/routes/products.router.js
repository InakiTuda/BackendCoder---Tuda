import {Router} from "express";
import { __dirname } from "../utils.js"
import ProductManager from "../dao/filemanagers/controllers/ProductManager.js";
import { parse } from "path";

const manager = new ProductManager(__dirname+"/files/products.json");
const router = Router();

router.get("/products",  async (req, res) => {
    const listaProducts = await manager.getProducts(req.query);
    res.json({message: "Success", listaProducts});
})

router.get("/products/:pid",  async (req, res) => {
    const foundProducts = await manager.getProductsById(req.params);
    res.send({status: "Success", foundProducts});
})

router.post("/products",  async (req, res) => {
    const newProducts = await manager.addProducts(req.body);
    res.send({status: "Success", newProducts});
})

router.put("/products/:pid",  async (req, res) => {
    const updatedProducts = await manager.updateProducts(req.params, req.body);
    res.send({status: "Success", updatedProducts});
})

router.delete("/products/:pid",  async (req, res) => {
    const id = parseInt(req.params.pid)
    const deletedProducts = await manager.deleteProducts(id);
    res.send({status: "Success", deletedProducts});
})

export default router;