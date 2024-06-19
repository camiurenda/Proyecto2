const Product = require("../../models/products");
const pager = require("../../utils/pager");

async function findAll(params) {
  let perPage = params.perPage ? params.perPage : 10;
  let page = Math.max(0, params.page);
  let filter = params.filter ? params.filter : {};
  let sort = params.sort ? params.sort : {};

  let count = await Product.countDocuments(filter);
  let data = await Product.find(filter)
    .limit(perPage)
    .skip(perPage * page)
    .sort(sort)
    .exec();

  return pager.createPager(page, data, count, perPage);
}

async function findById(id) {
  return await Product.findById(id).exec();
}

async function create(newProduct) {
  let product = new Product(newProduct);
  return await product.save();
}

async function update(id, updatedProduct) {
  return await Product.findByIdAndUpdate(id, updatedProduct, { new: true }).exec();
}

async function remove(id) {
  return await Product.findByIdAndDelete(id).exec();
}

module.exports = { findAll, findById, create, update, remove };