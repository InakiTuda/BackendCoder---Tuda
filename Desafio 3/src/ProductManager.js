import fs  from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path,
        this.products = []
    }

    getProducts = async () => {
        const productList = await fs.promises.readFile(this.path, "utf-8");
        const productListParse = JSON.parse(productList);
        return productListParse;
    }

    generateId = () => {
        const counter = this.products.length;
        if (counter === 0) {
            return 1;
        } else {
            return (this.products[counter-1].id)+1;
        }
    }

    addProducts = async (title, description, price, thumbnail, code, stock) => {
        if(!title, !description, !price, !thumbnail, !code, !stock) {
            console.error("Ingrese todos los datos del producto");
            return
        } else {
            const codigoRepetido = this.products.find(element => element.code === code);
            if (codigoRepetido) {
                console.error("El código del producto ya existe");
                return
            } else {
                const idGenerado = await this.generateId();
                const newProduct = {
                    id: idGenerado, title, description, price, thumbnail, code, stock
                }
                this.products.push(newProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
            }
        }
    }

    updateProducts = async (id, title, description, price, thumbnail, code, stock) => {
        if(!id, !title, !description, !price, !thumbnail, !code, !stock) {
            console.error("Ingrese todos los datos del producto para actualizarlo");
            return
        } else {
            const allProducts = await this.getProducts();
            const codigoRepetido = allProducts.find(element => element.code === code);
            if (codigoRepetido) {
                console.error("El código del producto ya existe");
                return
            } else {
                const listaProducts = await this.getProducts();
                const nuevaListaProducts = listaProducts.map(element => {
                    if(element.id === id) {
                        const productoActualizado = {
                            ...element, 
                            title, description, price, thumbnail, code, stock
                        }
                        return productoActualizado;
                    } else {
                        return element;
                    }
                })
                await fs.promises.writeFile(this.path, JSON.stringify(nuevaListaProducts, null, 2));
            }
        }
    }

    deleteProducts = async (id) => {
        const allProducts = await this.getProducts();
        const productoNoEncontrado = allProducts.filter(element => element.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(productoNoEncontrado, null, 2));
    }

    getProductsById = async (id) => {
        const allProducts = await this.getProducts();
        const encontrados = allProducts.find(element => element.id === id);
        return encontrados;
    }
}
