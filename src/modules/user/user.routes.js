const express = require("express");
const userService = require("./user.service");
const User = require("../../models/user"); 
const Product = require("../../models/products");

const router = express.Router();

// GET /api/user
router.get("/api/user", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    params = JSON.parse(req.headers['params'])

    let paginated = await userService.paginated(params)
    return res.status(200).send(paginated);

  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
});

// GET /api/user/:id
router.get("/api/user/:id",  async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    const user = await userService.findOneById(userId);
    return res.status(200).send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// POST /api/user
router.post("/api/user", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const newUser = req.body;
    console.log(newUser);
    const user = await userService.save(newUser);
    return res.status(201).send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// PUT /api/user/:id
router.put("/api/user/:id",  async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const user = await userService.update(userId, updatedUser);
    return res.status(200).send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// DELETE /api/user/:id
router.delete("/api/user/:id", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    await userService.remove(userId);
    return res.status(200).send("Usuario eliminado correctamente.");

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

    const userModel = await User.findById(userId); // Uso correcto del modelo User
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