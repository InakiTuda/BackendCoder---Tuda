import { Router } from "express";
import { CartManagerMongo } from "../DAL/DAOs/cartManagerMongo.js";
import { isUser } from "../middlewares/auth.middlewares.js";
import logger from "../winston.js";

const routerC = Router();
const CM = new CartManagerMongo();

/* Usar controllers */

// Crear carrito
routerC.post("/", (req, res) => {
    const newCart = CM.createCarts();
    logger.info("Carrito creado");
    res.status(400).json(newCart);
});

// Agregar productos al carrito
routerC.post("/:cid/product/:pid", isUser, async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity)) {
        logger.error("No se puede agregar está cantidad de productos al carrito");
        return res.status(404).send({status: "error", message: "No es posible agregar está cantidad de productos al carrito"});
    };
    const cart = CM.addProductsInCart(cid, pid, quantity);
    if (!cart) {
        logger.error("No se puede agregar productos al carrito");
        return res.status(404).send({status: "error", message: "No es posible agregar productos al carrito"});
    };
    res.json(cart);
});

// Actualizar productos del carrito
routerC.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body.products;
    try {
        const cart = await CM.updateProductsInCart(cid, products);
        res.json(cart);
    } catch (error) {
        logger.error("No se pudo actualizar el carrito");
        res.status(404).json({status: "error", message: "No se pudo actualizar el carrito"});
    }
});

// Eliminar producto por ID del carrito
routerC.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cart = await CM.deleteProductsInCart(cid, pid);
        if (!cart) {
            logger.error("Carrito NO encontrado");
            return res.status(404).send({status: "error", message: "Carrito NO encontrado"});
        }
        res.json(cart);
    } catch (error) {
        logger.error("No se pudo eliminar el producto");
        return res.status(404).send({status: "error", message: "No se pudo eliminar el producto"});
    };
});

// Ruta Purchase
routerC.post("/:cid/purchase", async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartsService.getCartsById(cid);
        if (!cart) {
            return res.status(300).json({error: "Carrito no encontrado"});
        }
        for (const productsOnCart of cart.products) {
            const product = await productsService.getProductsById(productsOnCart.product);
            if (!product) {
                return res.status(404).json({error: "Producto no encontrado"});
            }
            if (productsOnCart.quantity > product.stock) {
                return res.status(400).json({error: "No hay stock para el producto solicitado"});
            }
            product.stock -= productsOnCart.quantity;
            await product.save();
        }
        await cartsService.totalQuantityInCart(cart);
        // Ticket
        const ticketCompra = {
            code: await generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: cart.totalAmount,
            purchaser: "Iñaki Tuda"
        };
        const ticket = await ticketService.createTickets(ticketCompra);
        await cartsService.clearCart(cid);
        res.status(200).json({message: "Compra exitosa con ticket", ticket});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default routerC;