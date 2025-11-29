const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserAuth {
  // Inscription d'un nouvel utilisateur
  static async register(userData) {
    const { name, email, password, age } = userData;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await new Promise((resolve) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        resolve(row);
      });
    });

    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, age],
        function(err) {
          if (err) {
            reject(new Error('Erreur lors de l\'inscription: ' + err.message));
          } else {
            // Générer le token JWT
            const token = jwt.sign(
              { userId: this.lastID, email: email },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            resolve({
              token,
              user: {
                id: this.lastID,
                name,
                email,
                age,
                role: 'user'
              }
            });
          }
        }
      );
    });
  }

  // Connexion utilisateur
  static async login(email, password) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [email],
        async (err, user) => {
          if (err) {
            reject(new Error('Erreur de base de données'));
          } else if (!user) {
            reject(new Error('Utilisateur non trouvé'));
          } else {
            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
              reject(new Error('Mot de passe incorrect'));
            } else {
              // Générer le token JWT
              const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
              );

              resolve({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  age: user.age,
                  role: user.role
                }
              });
            }
          }
        }
      );
    });
  }

  // Vérifier le token
  static async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new Error('Token invalide'));
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = UserAuth;