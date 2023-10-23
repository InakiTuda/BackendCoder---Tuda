import { productsService } from "../services/products.service.js";

class ProductController {
    async addProducts(req, res) {
        try {
            const newProduct = await productsService.addProducts(req.body);
            res.status(200).json({product: newProduct})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async getProducts(req, res) {
        const {page, limit} = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        try {
            const products = await productsService.getProducts(pageNumber, limitNumber)
            res.status(200).json({products})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async getProductsById(req, res) {
        const {pid} = req.params;
        try {
            const product = await productsService.getProductsById(pid);
            if (product) {
                res.status(200).json({product})
            } else {
                return res.status(201).send({status: "error", message: "Producto con ID no encontrado"});
            }
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async updateProducts(req, res) {
        const {pid} = req.params;
        const {updatedProducts} = req.body;
        try {
            const updateProduct = await productsService.updateProducts(pid, updatedProducts);
            if (updateProduct) {
                res.status(200).json({product: updateProduct})
            } else {
                return res.status(201).send({status: "error", message: "Producto no encontrado"});
            }
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };

    async deleteProducts(req, res) {
        const {pid} = req.params;
        try {
            const deletedProducts = await productsService.deleteProducts(pid);
            if (deletedProducts) {
                res.status(200).json({product: deletedProducts})
            } else {
                return res.status(201).send({status: "error", message: "Producto no encontrado"});
            }
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };
};

export const productController = new ProductController();