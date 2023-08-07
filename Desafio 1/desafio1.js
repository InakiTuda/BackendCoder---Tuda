class ProductManager {
    constructor() {
        this.products = []
    }

    getProducts = () => {
        return this.products;
    }

    generateId = () => {
        const counter = this.products.length;
        if (counter === 0) {
            return 1;
        } else {
            return (this.products[counter-1].id)+1;
        }
    }

    addProducts = (title, description, price, thumbnail, code, stock) => {
        
        if (!title, !description, !price, !thumbnail, !code, !stock) {
            console.error("Ingrese todos los datos")
            return
        } else {
            const productFiltrado = this.products.find(element => element.code === code);
            const id = this.generateId();
                if (!productFiltrado) {
                    const newProduct = {
                        id : id, title, description, price, thumbnail, code, stock
                    }
                    this.products.push(newProduct);
                } else {
                    console.error("El código del producto ya existe")
                }
        }
    }

    getProductsById = (id) => {
        const productoEncontrado = this.products.find(element => element.id === id);
        if (!productoEncontrado) {
            console.error("Producto no encontrado");
            return
        } else {
            return productoEncontrado;
        }
    }
}

const products = new ProductManager();
products.addProducts('Producto prueba 1', 'Este es un primer producto prueba', 200, 'Sin imagen', 'abc123', 25);
products.addProducts('Producto prueba 2', 'Este es un segundo producto prueba', 250, 'Sin imagen', 'abc124', 30);
products.addProducts('Producto prueba 3', 'Este es un tercer producto prueba', 300, 'Sin imagen', 'abc125', 35);
products.addProducts('Producto prueba 4', 'Este es un cuarto producto prueba', 400, 'Sin imagen', 'abc126', 40);
console.log(products.getProducts());
console.log(products.getProductsById(3));