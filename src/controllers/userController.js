const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs',
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'ID utilisateur invalide'
      });
    }

    const user = await User.findById(userId);
    
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
    console.error('Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l utilisateur',
      message: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs (name, email, age) sont requis'
      });
    }

    const user = await User.create({ name, email, age: parseInt(age) });
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur createUser:', error);
    
    if (error.message.includes('existe déjà')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Erreur lors de la création de l utilisateur',
      message: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'ID utilisateur invalide'
      });
    }

    const { name, email, age } = req.body;
    
    const user = await User.update(userId, { name, email, age });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur updateUser:', error);
    
    if (error.message.includes('existe déjà')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l utilisateur',
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'ID utilisateur invalide'
      });
    }

    const user = await User.delete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l utilisateur',
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};