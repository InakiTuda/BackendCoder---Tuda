import express from "express";
import ProductManager from "./ProductManager.js";

const manager = new ProductManager("../files/products.json");
const app = express()
const PORT = 8080;

app.get("/products",  async (req, res) => {
    const {limit} = req.query
    const products = await manager.getProducts();
    if(limit) {
        const productsLimit = products.slice(0, limit);
        res.json({status: "Success", productsLimit});
    } else {
        res.json({status: "Success", products});
    }
})

app.get("/products/:pid",  async (req, res) => {
    const {pid} = req.params;
    const products = await manager.getProducts();
    const findProducts = products.find(element => element.id === parseInt(pid));
    console.log(findProducts);
    res.send({status: "Success", findProducts});
})

app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})