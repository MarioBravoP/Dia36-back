const express = require('express')
const authorController = require('../controllers/authorController')
const router = express.Router();

// Autores

// Obtener todos los autores
router.get("/", (req, res) => {
  authorController.getAuthors(req, res);
});

// Obtener autor por ID
router.get("/:id", (req, res) => {
  authorController.getAuthor(req,res)
})

module.exports = router
