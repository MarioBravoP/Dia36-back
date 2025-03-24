const express = require('express')
const publisherController = require('../controllers/publisherController')
const router = express.Router();

// Editores

// Obtener todos los editores
router.get("/", (req, res) => {
  publisherController.getPublishers(req, res);
});

// Obtener Libro por ID
router.get("/:id", (req, res) => {
  publisherController.getPublisher(req,res)
})

module.exports = router
