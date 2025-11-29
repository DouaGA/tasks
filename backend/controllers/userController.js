const UserModel = require('../models/userModel');

class UserController {
  // GET /api/users - Récupérer tous les utilisateurs
  static async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await UserModel.getAllUsers(page, limit);
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/search - Rechercher des utilisateurs
  static async searchUsers(req, res, next) {
    try {
      const { q, page, limit } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Terme de recherche requis'
        });
      }

      const result = await UserModel.searchUsers(q, page || 1, limit || 10);
      
      res.json({
        success: true,
        data: result.users,
        query: result.query,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/stats - Statistiques des utilisateurs
  static async getUserStats(req, res, next) {
    try {
      const stats = await UserModel.getUserStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id - Récupérer un utilisateur par ID
  static async getUserById(req, res, next) {
    try {
      const user = await UserModel.getUserById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users - Créer un nouvel utilisateur
  static async createUser(req, res, next) {
    try {
      const newUser = await UserModel.createUser(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/:id - Mettre à jour un utilisateur
  static async updateUser(req, res, next) {
    try {
      const updated = await UserModel.updateUser(req.params.id, req.body);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès'
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/:id - Supprimer un utilisateur
  static async deleteUser(req, res, next) {
    try {
      const deleted = await UserModel.deleteUser(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;