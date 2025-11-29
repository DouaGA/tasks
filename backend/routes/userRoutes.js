const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/users', UserController.getAllUsers);
router.get('/users/search', UserController.searchUsers);
router.get('/users/stats', UserController.getUserStats);
router.get('/users/:id', UserController.getUserById);

// Routes protégées
router.post('/users', authenticateToken, validateUser, UserController.createUser);
router.put('/users/:id', authenticateToken, validateUser, UserController.updateUser);
router.delete('/users/:id', authenticateToken, UserController.deleteUser);

module.exports = router;