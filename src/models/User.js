const { query, run } = require('../config/database');

class User {
  // Récupérer tous les utilisateurs
  static async findAll() {
    try {
      const users = await query(`
        SELECT id, name, email, age, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC
      `);
      return users;
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs: ${error.message}`);
    }
  }

  // Récupérer un utilisateur par ID
  static async findById(id) {
    try {
      const users = await query(
        'SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Erreur récupération utilisateur: ${error.message}`);
    }
  }

  // Récupérer un utilisateur par email
  static async findByEmail(email) {
    try {
      const users = await query(
        'SELECT id, name, email, age FROM users WHERE email = ?',
        [email]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Erreur recherche email: ${error.message}`);
    }
  }

  // Créer un nouvel utilisateur
  static async create(userData) {
    const { name, email, age } = userData;
    
    try {
      const result = await run(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [name, email, age]
      );
      
      // Récupérer l'utilisateur créé
      const user = await this.findById(result.id);
      return user;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      throw new Error(`Erreur création utilisateur: ${error.message}`);
    }
  }

  // Mettre à jour un utilisateur
  static async update(id, updates) {
    const { name, email, age } = updates;
    
    try {
      const fields = [];
      const values = [];

      if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
      }

      if (email !== undefined) {
        fields.push('email = ?');
        values.push(email);
      }

      if (age !== undefined) {
        fields.push('age = ?');
        values.push(age);
      }

      if (fields.length === 0) {
        throw new Error('Aucun champ à mettre à jour');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const queryText = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      await run(queryText, values);
      
      // Récupérer l'utilisateur mis à jour
      const user = await this.findById(id);
      return user;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Un autre utilisateur avec cet email existe déjà');
      }
      throw new Error(`Erreur mise à jour utilisateur: ${error.message}`);
    }
  }

  // Supprimer un utilisateur
  static async delete(id) {
    try {
      // Récupérer l'utilisateur avant suppression
      const user = await this.findById(id);
      if (!user) return null;
      
      await run('DELETE FROM users WHERE id = ?', [id]);
      return user;
    } catch (error) {
      throw new Error(`Erreur suppression utilisateur: ${error.message}`);
    }
  }
}

module.exports = User;