const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

// Routes pour les utilisateurs
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', validateUser, UserController.createUser);
router.put('/users/:id', validateUser, UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;