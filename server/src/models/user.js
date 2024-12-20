const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  domicilio:String,
  celular:String,
  documento:String,
  rol:String,
  area:String,
  productos: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
