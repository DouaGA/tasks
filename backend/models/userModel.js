const db = require('../config/database');

class UserModel {
  // Récupérer tous les utilisateurs
  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY id DESC', (err, rows) => {
        if (err) {
          reject(new Error('Erreur récupération utilisateurs: ' + err.message));
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(new Error('Erreur récupération utilisateur: ' + err.message));
        } else {
          resolve(row);
        }
      });
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
            resolve({ id: this.lastID, name, email, age });
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
        'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
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

  // Supprimer un utilisateur
  static async deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(new Error('Erreur suppression utilisateur: ' + err.message));
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = UserModel;