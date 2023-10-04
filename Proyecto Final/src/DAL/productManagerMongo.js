import {productsModel} from "../db/models/products.model.js";

export default class ProductManager {
  // Add Products
  async addProduct(product) {
    try {
      const newProduct = new productsModel(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log('Error al agregar producto', error.message);
      throw new Error('Error al agregar producto');
    }
  }

  async getProductsCount(queryOptions = {}) {
    return await productsModel.countDocuments(queryOptions);
  }
  
  // GetProducts con 10 por página
  async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    const options = {
      sort: sortOptions,
      page: page,
      limit: limit,
      lean: true,
    };
    const result = await productsModel.paginate(queryOptions, options);
    return result;
  }

  // Productos por ID
  async getProductById(id) {
    try {
      const product = await productsModel.findById(id);
      return product;
    } catch (error) {
      console.log('Error al obtener producto por ID', error.message);
      throw new Error('Error al obtener producto por ID');
    }
  }

  //Actualizar producto
  async updateProduct(id, updatedProducts) {
    try {
      const product = await productsModel.findByIdAndUpdate(id, updatedProducts, {new: true});
      return product;
    } catch (error) {
      console.log('Error al actualizar producto', error.message);
      throw new Error('Error al actualizar producto');
    }
  }

  //Eliminar producto por ID
  async deleteProduct(id) {
    try {
      const deletedProduct = await productsModel.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      console.log('Error al eliminar producto', error.message);
      throw new Error('Error al eliminar producto');
    }
  }
}

export {ProductManager};