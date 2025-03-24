const express = require('express')
const inventoryController = require('../controllers/inventoryController')
const router = express.Router();

// Inventario

// Obtener todos los inventarios
router.get("/", (req, res) => {
    inventoryController.getInventories(req, res);
});

// Obtener entradas por ID de libro
router.get("/:id", (req, res) => {
    inventoryController.getInventory(req, res);
})

// Crear entrada de inventario
router.post("/", (req, res) => {
    inventoryController.createInventory(req, res);
})

// Modificar stock de entrada
router.put("/:id", (req, res) => {
    inventoryController.updateInventory(req, res);
})

// Eliminar entrada
router.delete("/:id", (req, res) => {
    inventoryController.deleteInventory(req, res);
})

module.exports = router;