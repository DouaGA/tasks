const UserAuth = require('../models/UserAuth');

class AuthController {
  // POST /api/auth/register - Inscription
  static async register(req, res, next) {
    try {
      const result = await UserAuth.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/login - Connexion
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis'
        });
      }

      const result = await UserAuth.login(email, password);
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/verify - Vérifier le token
  static async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token manquant'
        });
      }

      const decoded = await UserAuth.verifyToken(token);
      
      res.json({
        success: true,
        data: decoded
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me - Profil utilisateur connecté
  static async getProfile(req, res, next) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;