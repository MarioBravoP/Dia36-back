const express = require('express')
const usersController = require('../controllers/usersController')
const router = express.Router();

// Usuarios

// Obtener todos los Usuarios
router.get("/", (req, res) => {
  usersController.getUsers(req, res);
});

// Logear por userName
router.post("/login", (req, res) => {
  usersController.loginUser(req,res)
})

// Crear Usuario
router.post("/register", (req, res) => {
  usersController.registerUser(req, res);
});

// Borrar Usuario
router.delete("/:id", (req, res) => {
  usersController.deleteUser(req, res);
});

// Actualizar Usuario
router.put("/:id", (req, res) => {
  usersController.updateUser(req, res)
})

module.exports = router
