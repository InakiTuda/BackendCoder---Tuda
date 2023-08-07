const fs  = require("fs");

class ProductManager {
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

async function generator() {
    const products = new ProductManager("./files/products.json");
    //await products.addProducts("Producto prueba 1", "Este es un primer producto prueba", 200, 'Sin imagen', 'abc123', 25);
    //await products.addProducts("Producto prueba 2", "Este es un segundo producto prueba", 250, 'Sin imagen', 'abc124', 30);
    //await products.addProducts("Producto prueba 3", "Este es un tercer producto prueba", 300, 'Sin imagen', 'abc125', 35);
    //await products.updateProducts(3, "Producto prueba 3b", "Este es un tercer producto prueba B", 300, 'Sin imagen', 'abc125c', 35);
    //await products.deleteProducts(3)
    const solo = await products.getProductsById(2)
    //const listado = await products.getProducts()
    console.log(solo);
}

generator()