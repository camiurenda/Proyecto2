const express = require("express");
const productService = require("./products.service");

const router = express.Router();

// GET 
router.get("/api/products", async (req, res) => {
      // #swagger.tags = ['Producto']
  try {
    const params = JSON.parse(req.headers["params"]);
    const paginated = await productService.findAll(params);
    return res.status(200).send(paginated);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// GET (id)
router.get("/api/products/:id", async (req, res) => {
          // #swagger.tags = ['Producto']
  try {
    const productId = req.params.id;
    const product = await productService.findById(productId);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// post
router.post("/api/products", async (req, res) => {
          // #swagger.tags = ['Producto']
  try {
    const newProduct = req.body;
    const product = await productService.create(newProduct);
    return res.status(201).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//update
router.put("/api/products/:id", async (req, res) => {
          // #swagger.tags = ['Producto']
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const product = await productService.update(productId, updatedProduct);
    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//delete
router.delete("/api/products/:id", async (req, res) => {
          // #swagger.tags = ['Producto']
  try {
    const productId = req.params.id;
    await productService.remove(productId);
    return res.status(200).send("Producto eliminado correctamente.");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Post para asociar usuario y producto
router.post("/api/users/:userId/products/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log(`Received request to associate product ${productId} with user ${userId}`);

    const user = await User.findById(userId); // Uso correcto del modelo User
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).send({ message: "User not found" });
    }

    const product = await Product.findById(productId); // Uso correcto del modelo Product
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return res.status(404).send({ message: "Product not found" });
    }

    user.productos.push(productId);
    await user.save();
    console.log(`Product ${productId} associated with user ${userId}`);
    res.status(200).send(user);
  } catch (error) {
    console.error(`Error associating product with user: ${error.message}`);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;

