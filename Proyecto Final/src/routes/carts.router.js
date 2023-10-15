import {Router} from "express";
const routerC = Router()
import {CartManagerMongo} from "../DAL/DAOs/cartManagerMongo.js";
import {ProductManagerMongo} from "../DAL/DAOs/productManagerMongo.js";

const cm = new CartManagerMongo();
const pm = new ProductManagerMongo();

// Corroborar carritos
routerC.get("/", async (req, res) => {
    const carrito = await cm.getCarts();
    res.json({carrito});
});

// Devolver carrito
routerC.get("/:cid", async (req, res) => {
    const {cid} = req.params;
    const carritoFound = await cm.getCartById(cid);
    res.json({status: "success", carritoFound});
});

// Crear carrito con o sin productos
routerC.post("/", async (req, res) => {
    try {
        const {obj} = req.body;
        if (!Array.isArray(obj)) {
            return res.status(400).send("Tu pedido es incorrecto: Los productos deben ser array");
        }
        const validProducts = [];
        for (const product of obj) {
            const checkId = await pm.getProductsById(product._id);
            if (checkId === null) {
                return res.status(404).send(`Product con ID ${product._id} no encontrado`);
            }
            validProducts.push(checkId);
        }
        const cart = await cm.addCart(validProducts);
        res.status(200).send(cart);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error Interno Servidor");
    }
});

// Poner cantidad de un producto
routerC.post("/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    try {
        const checkIdProduct = await pm.getProductsById(pid);
        if (!checkIdProduct) {
            return res.status(404).send({message: `Producto con ID: ${pid} no encontrado`});
        }
        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({message: `Carrito con ID: ${pid} no encontrado`});
        }
        const result = await cm.addProductInCart(cid, {_id: pid, quantity: quantity});
        console.log(result);
        return res.status(200).send({
            message: `Product con ID: ${pid} agregado al carrito con ID: ${cid}`,
            cart: result,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({message: "Ocurrio un error mientras se procesa el pedido"});
    }
});

// Actualizar lista de productos en el carrito
routerC.put("/:cid", async (req, res) => {
    try {
        const {cid} = req.params;
        const {products} = req.body;
        // Verificar si existe un producto antes de actualizar el carrito
        for (const product of products) {
            const checkId = await pm.getProductsById(product._id);
            if (!checkId) {
                return res.status(404).send({status: "error", message: `El producto con ID: ${product._id} no fue encontrado`});
            }
        }
        // Verificar si carrito con ID cid existe
        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({status: "error", message: `El carrito con ID: ${cid} no fue encontrado`});
        }
        // Actualizar carrito en la BD con la lista de productos actualizada
        const cart = await cm.updateProductsInCart(cid, products);
        return res.status(200).send({status: "success", payload: cart});
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: "error", message: "Ocurrio un error mientras se procesa el pedido"});
    }
});

// Eliminar un producto del carrito
routerC.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;
        // Verificar si producto con ID pid existe
        const checkIdProduct = await pm.getProductsById(pid);
        if (!checkIdProduct) {
            return res.status(404).send({status: "eror", message: `Producto con ID: ${pid} no encontrado`});
        }
        // Verificar si carrito con ID cid existe
        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({status: "eror", message: `Carrito con ID: ${cid} no encontrado`});
        }
        // Buscar el Index del producto en la lista de productos del carrito
        const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid);
        if (findProductIndex === -1) {
            return res.status(404).send({status: "error", message: `Producto con ID: ${pid} no encontrado en carrito`});
        }
        // Eliminar el producto de la lista de productos del carrito
        checkIdCart.products.splice(findProductIndex, 1);
        // Actualizar el carrito en la base de datos sin el producto eliminado
        const updatedCart = await cm.deleteProductInCart(cid, checkIdCart.products);
        return res.status(200).send({status: "success", message: `Producto con ID: ${pid} eliminado`, cart: updatedCart});
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: "error", message: "Ocurrio un error mientras se procesa el pedido"});
    }
});

// Eliminar todos los productos de un carrito
routerC.delete("/:cid", async (req, res) => {
    try {
        const {cid} = req.params;
        const cart = await cm.getCartById(cid);
        if (!cart) {
            return res.status(404).send({message: `Carrito con ID: ${cid} no encontrado`})
        }
        if (cart.products.length === 0) {
            return res.status(404).send({message: "El carrito ya está vacio"})
        }
        // Vaciar el carrito estableciendo la propiedad "products" como un array vacio
        cart.products = [];
        await cm.updateOneProduct(cid, cart.products);
        return res.status(200).send({
            status: "success",
            message: `Carrito con ID: ${cid} fue vaciado correctamente`,
            cart: cart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Ocurrio un error mientras se procesa el pedido"});
    }
});

export default routerC;