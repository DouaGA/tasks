const UserModel = require('../models/userModel');

class UserController {
  // GET /api/users - Récupérer tous les utilisateurs
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/users/:id - Récupérer un utilisateur par ID
  static async getUserById(req, res) {
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
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /api/users - Créer un nouvel utilisateur
  static async createUser(req, res) {
    try {
      const newUser = await UserModel.createUser(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: newUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/users/:id - Mettre à jour un utilisateur
  static async updateUser(req, res) {
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
        message: 'Utilisateur mis à jour avec succès',
        data: { id: req.params.id, ...req.body }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/users/:id - Supprimer un utilisateur
  static async deleteUser(req, res) {
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
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserController;