import { error } from "console";
import fs  from "fs";

export default class CartManager {
    constructor(path) {
        this.path = path
    }

    getCarts = async () => {
        try {
            if(fs.existsSync(this.path)) {
                const cartList = await fs.promises.readFile(this.path, "utf-8");
                const cartListParse = JSON.parse(cartList);
                return cartListParse;
            } else {
                return [];
            }
        }
        catch(error) {
            throw new Error(error);
        }
    }

    getCartsById = async (id) => {
        const {cid} = id;
        const allCarts = await this.getCarts({});
        const found = allCarts.find(element => element.id === parseInt(cid));
        if(found) {
            return found;
        } else {
            console.error("Carrito NO encontrado");
        }
    }

    generateCartId = async () => {
        if(fs.existsSync(this.path)) {
            const listaCarts = await this.getCarts({})
            const counter = listaCarts.length;
            if(counter === 0) {
                return 1;
            } else {
                return (listaCarts[counter-1].id)+1;
            }
        }
    }

    addCarts = async () => {
        const listaCarts = await this.getCarts();
            const id = await this.generateCartId();
            const newCart = {
                id, products : []
            }
            listaCarts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(listaCarts, null, 2));
    }


    addProductsToCarts = async (cid, pid) => {
        const listaCarts = await this.getCarts();
        const cart = listaCarts.find(e => e.id === cid);
        const productIndex = cart.products.findIndex(element => element.id === pid);
            if(productIndex !== -1) {
                cart.products[productIndex].quantity++;
                } else {
                cart.products.push({
                    pid, quantity : 1
                });
            }
            await fs.promises.writeFile(this.path, JSON.stringify(listaCarts, null, 2));
        }
    }