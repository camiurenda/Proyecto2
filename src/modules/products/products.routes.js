const express = require("express");
const productService = require("./product.service");

const router = express.Router();

// GET 
router.get("/api/products", async (req, res) => {
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
  try {
    const productId = req.params.id;
    await productService.remove(productId);
    return res.status(200).send("Producto eliminado correctamente.");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;

