import {productsModel} from "../mongoDB/models/products.model.js";

class ProductManagerMongo {
  async addProduct(product) {
    const newProduct = new productsModel(product);
    await newProduct.save();
    return newProduct;
  }

  async getProductsCount(queryOptions = {}) {
    return await productsModel.countDocuments(queryOptions);
  }

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

  async getProductById(id) {
    return await productsModel.findById(id);
  }

  async updateProduct(id, updatedProducts) {
    const updatedProduct = await productsModel.findByIdAndUpdate(id, updatedProducts, { new: true });
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await productsModel.findByIdAndDelete(id);
    return deletedProduct;
  }
}

export { ProductManagerMongo };