const express = require('express')
const storesController = require('../controllers/storesController')
const router = express.Router();

// Tiendas

// Obtener todas las tiendas
router.get("/", (req, res) => {
  storesController.getStores(req, res);
});

// Obtener tienda por ID
router.get("/:id", (req, res) => {
  storesController.getStore(req,res)
})

module.exports = router
