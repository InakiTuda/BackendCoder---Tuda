import {productsModel}  from "../models/products.model.js";

export default class ProductManager {
    findAll = async (obj) => {
        const {limit, page, sortPrice, ...query} = obj
        console.log(query)
        try {
            const result = await productsModel.paginate(query, {limit, page, sort:{price: sortPrice}});
            const info = {
                count: result.totalDocs,
                payload: result.docs,
                totalPages: result.totalPages,
                nextLink: result.hasNextPage
                ? `http://localhost:8080/api/products?page=${result.nextPage}`
                : null,
                prevLink: result.hasPrevPage
                ? `http://localhost:8080/api/products?page=${result.prevPage}`
                : null,
            } 
            return {info};
        } catch (error) {
            return error;
        }
    }

    getProductsView = async () => {
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err;
        }
    };

    getProducts = async (filter, options) => {
        try {
            return await productsModel.paginate(filter, options);
        } catch (err) {
            return err;
        }
    };

    getProductsById = async (id) => {
        try {
            return await productsModel.findById(id);
        } catch (err) {
            return {error: err.message}
        }
    };

    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({title: product.title})
        } catch (err) {
            return err;
        }
    };

    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, {$set: product})
        } catch (err) {
            return err;
        }
    };

    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err;
        }
    };
};