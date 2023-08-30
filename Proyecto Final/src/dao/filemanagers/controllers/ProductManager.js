import { error } from "console";
import fs  from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    getProducts = async (info) => {
        const {limit} = info;
        try {
            if(fs.existsSync(this.path)) {
                const productList = await fs.promises.readFile(this.path, "utf-8");
                const productListParse = JSON.parse(productList);
                const productListSlice = productListParse.slice(0, limit);
                return productListSlice;
            } else {
                console.error("Error al listar productos");
                return
            }
        }
        catch(error) {
            throw new Error(error);
        }
    }

    getProductsById = async (id) => {
        const {pid} = id;
        const allProducts = await this.getProducts({});
        const found = allProducts.find(element => element.id === parseInt(pid));
        if(found) {
            return found;
        } else {
            console.error("Producto NO encontrado");
        }
    }

    generateId = async () => {
        if(fs.existsSync(this.path)) {
            const listaProducts = await this.getProducts({})
            const counter = listaProducts.length;
            if(counter === 0) {
                return 1;
            } else {
                return (listaProducts[counter-1].id)+1;
            }
        }
    }

    addProducts = async (obj) => {
        const {title, description, price, thumbnail, code, stock, category, status = true} = obj;
        if(title === undefined, description === undefined, price === undefined, thumbnail === undefined, code === undefined, stock === undefined, category === undefined, status === undefined) {
            console.error("Ingrese todos los datos del producto");
            return
        } else {
            const listaProducts = await this.getProducts({});
            const codigoRepetido = listaProducts.find(element => element.code === code);
            if (codigoRepetido) {
                console.error("El código del producto ya existe");
                return
            } else {
                const idGenerado = await this.generateId();
                const newProduct = {
                    id: idGenerado, title, description, price, thumbnail, code, stock, category, status
                }
                listaProducts.push(newProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(listaProducts, null, 2))
            }
        }
    }

    updateProducts = async (id, obj) => {
        const {pid} = id;
        const {title, description, price, thumbnail, code, stock, category, status = true} = obj;
        if(title === undefined, description === undefined, price === undefined, thumbnail === undefined, code === undefined, stock === undefined, category === undefined, status === undefined) {
            console.error("Ingrese todos los datos del producto para actualizarlo");
            return
        } else {
            const allProducts = await this.getProducts({});
            const codigoRepetido = allProducts.find(element => element.code === code);
            if (codigoRepetido) {
                console.error("El código del producto ya existe");
                return
            } else {
                const listaProducts = await this.getProducts({});
                const nuevaListaProducts = listaProducts.map(element => {
                    if(element.id === parseInt(pid)) {
                        const updatedProducts = {
                            ...element, 
                            title, description, price, thumbnail, code, stock, category, status
                        }
                        return updatedProducts;
                    } else {
                        return element;
                    }
                })
                await fs.promises.writeFile(this.path, JSON.stringify(nuevaListaProducts, null, 2));
            }
        }
    }

    deleteProducts = async (pid) => {
        const allProducts = await this.getProducts({});
        const productoNoEncontrado = allProducts.filter(element => element.id !== parseInt(pid));
        await fs.promises.writeFile(this.path, JSON.stringify(productoNoEncontrado, null, 2));
    }
}
