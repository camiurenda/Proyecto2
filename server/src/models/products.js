const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: false },
  categoria: { type: String, required: true },
  enStock: { type: Boolean, default: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;