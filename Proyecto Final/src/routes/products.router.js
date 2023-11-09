import { Router } from "express";
import { ProductManagerMongo } from "../DAL/DAOs/productManagerMongo.js";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import logger from "../winston.js";

const routerP = Router();
const PM = new ProductManagerMongo();

/* Usar controllers */

// Crear productos
routerP.post("/", isAdmin, (req, res) => {
    const {title, description, price, stock, thumbnail, code, category, status} = req.body;
    const product = {
        title, 
        description, 
        price, 
        stock: stock, 
        thumbnail, 
        code, 
        category, 
        status: true,
    };
    const newProduct = PM.addProduct(product);
    if (newProduct) {
        logger.info("Producto creado");
        res.status(300).json(newProduct)
    } else {
        logger.error("Producto NO pudo ser creado");
    }
});

// Buscar todos los productos
routerP.get('/', async (req, res) => {
    try {
      const { limit = 10, page = 1, query, sort } = req.query;
      let queryOptions = {};
      if (query) {
        queryOptions = {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
          ],
        };
      }
      const sortOptions = {};
      if (sort === 'asc') {
        sortOptions.price = 1; // Orden ascendente por precio
      } else if (sort === 'desc') {
        sortOptions.price = -1; // Orden descendente por precio
      }
      const productsPaginated = await PM.getProducts(queryOptions, sortOptions, limit, page);
      const response = {
        status: 'success',
        payload: productsPaginated.docs, 
        totalPages: productsPaginated.totalPages,
        prevPage: productsPaginated.hasPrevPage ? productsPaginated.prevPage : null,
        nextPage: productsPaginated.hasNextPage ? productsPaginated.nextPage : null,
        page: productsPaginated.page,
        hasPrevPage: productsPaginated.hasPrevPage,
        hasNextPage: productsPaginated.hasNextPage,
        prevLink: productsPaginated.hasPrevPage ? `/api/products?limit=${limit}&page=${productsPaginated.prevPage}&query=${query}&sort=${sort}` : null,
        nextLink: productsPaginated.hasNextPage ? `/api/products?limit=${limit}&page=${productsPaginated.nextPage}&query=${query}&sort=${sort}` : null,
      };
      res.json(response);
    } catch (error) {
      logger.error("No es posible traer la lista de productos");
      return res.status(500).send({status: "error", message: "No es posible traer la lista de productos"});
    }
});

// Buscar producto por ID
routerP.get("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await PM.getProductById(productId)
        if (!product) {
            return res.status(404).json({status: "error", message: "Producto NO encontrado"});
        }
        res.json(product);
    } catch (error) {
        logger.error("Producto NO encontrado");
    }
});

// Actualizar producto por ID
routerP.put("/:pid", isAdmin, async (req, res) => {
    const productId = req.params.pid;
    const updatedProducts = req.body;
    await PM.updateProduct(productId, updatedProducts);
    logger.info("Producto Actualizado");
    return res.status(500).send({status: "success", message: "Producto Actualizado"});
});

// Eliminar un producto por ID
routerP.delete("/:pid", isAdmin, async (req, res) => {
    const productId = req.params.pid;
    await PM.deleteProduct(productId);
    logger.info("Producto Eliminado");
    return res.status(500).send({status: "success", message: "Producto Eliminado"});
})

export default routerP;