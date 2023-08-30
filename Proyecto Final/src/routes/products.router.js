import {Router} from "express";
const routerP = Router();
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";
const pm = new ProductManager();

routerP.get("/", async (req, res) => {
    try {
        const products = await pm.findAll(req.query);
        res.status(200).json({products})
    } catch (error) {
        res.status(500).json({error})
    }
});

routerP.get("/:pid", async (req, res) => {
    const {pid} = req.params;
    const productFind = await pm.getProductsById(pid);
    res.json({status: "success", productFind});
});

routerP.post("/", async (req, res) => {
    const obj = req.body;
    const newProduct = await pm.addProduct(obj);
    res.json({status: "success", newProduct});
});

routerP.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const obj = req.body;
    const updatedProduct = await pm.updateProduct(pid, obj);
    console.log(updatedProduct)
        res.json({status: "sucess", updatedProduct});
});

routerP.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    const deleteproduct = await pm.deleteProduct(id);
    res.json({status: "sucess", deleteproduct});
});

export default routerP;