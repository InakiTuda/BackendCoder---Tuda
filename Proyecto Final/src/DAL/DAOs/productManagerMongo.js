import {productsModel} from "../mongoDB/models/products.model.js";

class ProductManagerMongo {
  async addProduct(product) {
    const newProduct = new productsModel(product);
    return newProduct;
  };
  
  async getProductsCount(queryOptions = {}) {
    return await productsModel.countDocuments(queryOptions);
  };

  async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    const options = {
      sort: sortOptions,
      page: page,
      limit: limit,
      lean: true,
    };
    const result = await productsModel.paginate(queryOptions, options);
    return result;
  };

  async getProductsById(id) {
    return await productsModel.findById(id);
  };

  async updateProduct(id, updatedProducts) {
    const updateProducts = await productsModel.findByIdAndUpdate(id, updatedProducts);
    return updateProducts;
  };

  async deleteProducts(id) {
    const deletedProducts = await productsModel.findByIdAndDelete(id);
    return deletedProducts;
  };
};

export {ProductManagerMongo};