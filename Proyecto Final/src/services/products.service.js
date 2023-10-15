import { ProductManagerMongo } from "../DAL/DAOs/productManagerMongo.js";

class ProductsService {
    constructor() {
        this.productsManager = new ProductManagerMongo();
    };
    async addProducts(product) {
        const newProduct = await this.productsManager.addProducts(product);
        return newProduct;
    };

    async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
        const products = await this.productsManager.getProducts(queryOptions, sortOptions, limit, page);
        return products;
    };

    async getProductsById(id) {
        const product = await this.productsManager.getProductsById(id);
        return product;
    };

    async updateProducts(id, updatedProducts) {
        const updateProducts = await this.productsManager.updateProducts(id, updatedProducts);
        return updateProducts;
    };

    async deleteProducts(id) {
        const deletedProducts = await this.productsManager.deleteProducts(id);
        return deletedProducts;
    };
};

export const productsService = new ProductsService();