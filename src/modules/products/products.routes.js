const express = require("express");
const productService = require("./products.service");
const router = express.Router();

// GET 
router.get("/api/products", async (req, res) => {
  // #swagger.tags = ['Producto']
  try {
    const { page = 0, perPage = 10, filter = "{}", sort = "{}" } = req.query;
    const parsedFilter = JSON.parse(filter);
    const parsedSort = JSON.parse(sort);
    const params = {
      page: parseInt(page),
      perPage: parseInt(perPage),
      filter: parsedFilter,
      sort: parsedSort
    };
    const paginatedProducts = await productService.findAll(params);

    res.status(200).send(paginatedProducts); 

  } catch (error) {
    console.error(`Error paginating products: ${error.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// GET (id)
router.get("/api/products/:id", async (req, res) => {
          // #swagger.tags = ['Producto']
  try {
    const productId = req.params.id;
    const product = await productService.findById(productId);
    if (!product) {
      return res.status(404).send("El producto no ha sido encontrado");
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

module.exports = router;

