const express = require("express");
const userService = require("./user.service");
const Product = require("../../models/products");
const User = require("../../models/user")

const router = express.Router();

// GET /api/user
router.get("/api/users", async (req, res) => {
  try {
      const { page = 0, perPage = 10, filter = "{}", sort = "{}" } = req.query; // Captura los parámetros de consulta
      const parsedFilter = JSON.parse(filter); // Convertir cadena a objeto JSON
      const parsedSort = JSON.parse(sort); // Convertir cadena a objeto JSON
      const paginatedUsers = await userService.paginated({ page, perPage, filter: parsedFilter, sort: parsedSort });
      res.status(200).send(paginatedUsers);
  } catch (error) {
      console.error(`Error en el paginado: ${error.message}`);
      res.status(500).send({ message: error.message });
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

router.get("/api/user/:userId/products", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
                          .populate('productos')
                          .exec();
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        documento: user.documento
      },
      products: user.productos || []
    });
  } catch (error) {
    console.error("Error al obtener los productos del usuario:", error);
    return res.status(500).json({ 
      message: "Error al obtener los productos del usuario",
      error: error.message 
    });
  }
});

//Post para asociar usuario y producto
router.post("/api/user/:userId/product/:productId", async (req, res) => {
  try {
      const { userId, productId } = req.params;

      // Find user and product
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      // Associate product with user
      user.productos.push(productId);
      await user.save(); // Save the updated user

      res.status(200).json({ message: "Product associated with user successfully", user }); 
  } catch (error) {
      console.error("Error associating product with user:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;