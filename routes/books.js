const express = require('express')
const booksController = require('../controllers/booksController')
const router = express.Router();
const { authJWT } = require('../middlewares/authJWT')

// Libros

// Obtener todos los libros
router.get("/", (req, res) => {
  booksController.getBooks(req, res);
});

// Obtener Libro por ID
router.get("/:id", (req, res) => {
  booksController.getBook(req,res)
})

// Crear Libro
router.post("/", authJWT ,(req, res) => {
  booksController.createBook(req, res);
});

// Borrar Libro
router.delete("/:id", (req, res) => {
  booksController.deleteBook(req, res);
});

// Actualizar Libro
router.put("/:id", (req, res) => {
  booksController.updateBook(req, res)
})

module.exports = router
