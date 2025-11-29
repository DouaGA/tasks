const db = require('../config/database');

class UserModel {
  // Récupérer tous les utilisateurs (avec pagination)
  static async getAllUsers(page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      db.all(
        `SELECT id, name, email, age, role, created_at 
         FROM users 
         WHERE is_active = 1 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows) => {
          if (err) {
            reject(new Error('Erreur récupération utilisateurs: ' + err.message));
          } else {
            // Récupérer le total count
            db.get(
              'SELECT COUNT(*) as total FROM users WHERE is_active = 1',
              (err, countResult) => {
                if (err) {
                  reject(new Error('Erreur comptage utilisateurs: ' + err.message));
                } else {
                  resolve({
                    users: rows,
                    pagination: {
                      page: parseInt(page),
                      limit: parseInt(limit),
                      total: countResult.total,
                      pages: Math.ceil(countResult.total / limit)
                    }
                  });
                }
              }
            );
          }
        }
      );
    });
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, age, role, created_at, updated_at 
         FROM users 
         WHERE id = ? AND is_active = 1`,
        [id],
        (err, row) => {
          if (err) {
            reject(new Error('Erreur récupération utilisateur: ' + err.message));
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  // Rechercher des utilisateurs
  static async searchUsers(query, page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const searchQuery = `%${query}%`;
      
      db.all(
        `SELECT id, name, email, age, role, created_at 
         FROM users 
         WHERE is_active = 1 
         AND (name LIKE ? OR email LIKE ?)
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [searchQuery, searchQuery, limit, offset],
        (err, rows) => {
          if (err) {
            reject(new Error('Erreur recherche utilisateurs: ' + err.message));
          } else {
            resolve({
              users: rows,
              query: query,
              pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: rows.length
              }
            });
          }
        }
      );
    });
  }

  // Créer un nouvel utilisateur
  static async createUser(userData) {
    const { name, email, age } = userData;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [name, email, age],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new Error('Un utilisateur avec cet email existe déjà'));
            } else {
              reject(new Error('Erreur création utilisateur: ' + err.message));
            }
          } else {
            // Récupérer l'utilisateur créé
            db.get(
              'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?',
              [this.lastID],
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              }
            );
          }
        }
      );
    });
  }

  // Mettre à jour un utilisateur
  static async updateUser(id, userData) {
    const { name, email, age } = userData;
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET name = ?, email = ?, age = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND is_active = 1`,
        [name, email, age, id],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new Error('Un utilisateur avec cet email existe déjà'));
            } else {
              reject(new Error('Erreur mise à jour utilisateur: ' + err.message));
            }
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  // Supprimer un utilisateur (soft delete)
  static async deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(new Error('Erreur suppression utilisateur: ' + err.message));
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  // Statistiques des utilisateurs
  static async getUserStats() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(*) as totalUsers,
          AVG(age) as averageAge,
          COUNT(CASE WHEN created_at > datetime('now', '-7 days') THEN 1 END) as recentUsers,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as adminUsers
         FROM users 
         WHERE is_active = 1`,
        (err, row) => {
          if (err) {
            reject(new Error('Erreur statistiques: ' + err.message));
          } else {
            resolve(row);
          }
        }
      );
    });
  }
}

module.exports = UserModel;