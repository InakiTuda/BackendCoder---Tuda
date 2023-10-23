import { cartsService } from "../services/carts.service.js";

class CartController {
    async createCarts(req, res) {
        try {
            const newCart = await cartsService.createCarts();
            res.status(200).json({cart: newCart})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    }

    async addProductsInCart(req, res) {
        const {cid} = req.params;
        const {pid, quantity} = req.body;
        try {
            const cart = await cartsService.addProductsInCart(cid, pid, quantity);
            const cartQuantity = await cartsService.totalQuantityInCart(cart);
            res.status(200).json({cart: cartQuantity})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async deleteProductsInCart(req, res) {
        const {cid} = req.params;
        const {pid} = req.body;
        try {
            const cart = await cartsService.addProductsInCart(cid, pid);
            const cartQuantity = await cartsService.totalQuantityInCart(cart);
            res.status(200).json({cart: cartQuantity})
        } catch (error) {
            return res.status(300).send({status: "error"});
        } 
    };

    async updateProductsInCart(req, res) {
        const {cid} = req.params;
        const {newProductsInCart} = req.body;
        try {
            const cart = await cartsService.updateProductsInCart(cid, newProductsInCart);
            res.status(200).json({cart})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async updateProductsQuantityInCart(req, res) {
        const {cid, pid} = req.params;
        const {newQuantity} = req.body;
        try {
            const cart = await cartsService.updateProductsQuantityInCart(cid, pid, newQuantity);
            res.status(200).json({cart})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async clearCart(req, res) {
        const {cid} = req.params;
        try {
            const cart = await cartsService.clearCart(cid);
            const cartQuantity = await cartsService.totalQuantityInCart(cart);
            res.status(200).json({cart: cartQuantity})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };
}

export const cartController = new CartController();