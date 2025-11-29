const express = require('express');
const AuthController = require('../controllers/authController');
const { validateUser } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Routes d'authentification
router.post('/auth/register', validateUser, AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/verify', AuthController.verifyToken);
router.get('/auth/me', authenticateToken, AuthController.getProfile);

module.exports = router;