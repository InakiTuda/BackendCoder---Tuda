import {Router} from "express";
import { __dirname } from "../utils.js";
import CartManager from "../dao/filemanagers/controllers/CartManager.js"

const manager = new CartManager(__dirname+"/files/carts.json");
const router = Router();

router.get("/carts",  async (req, res) => {
    const listaCarts = await manager.getCarts();
    res.json({message: "Success", listaCarts})
})

router.get("/carts/:cid",  async (req, res) => {
    const foundCarts = await manager.getCartsById(req.params);
    res.send({status: "Success", foundCarts});
})

router.post("/carts",  async (req, res) => {
    const newCarts = await manager.addCarts(req.body);
    res.send({status: "Success", newCarts});
})

router.post("/carts/:cid/products/:pid",  async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const addProductToCarts = await manager.addProductsToCarts(cid, pid);
    res.send({status: "Success", addProductToCarts});
})

export default router;