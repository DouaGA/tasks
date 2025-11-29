const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', '..', process.env.DB_FILE || 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion SQLite:', err.message);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erreur création table:', err.message);
    } else {
      console.log('✅ Table users prête');
      
      // Insérer des données de test
      const insertTestData = `
        INSERT OR IGNORE INTO users (name, email, age) VALUES
        ('John Doe', 'john@example.com', 30),
        ('Jane Smith', 'jane@example.com', 25),
        ('Bob Johnson', 'bob@example.com', 35)
      `;
      
      db.run(insertTestData, (err) => {
        if (err) {
          console.error('❌ Erreur insertion données test:', err.message);
        } else {
          console.log('✅ Données de test insérées');
        }
      });
    }
  });
}

// Fonction pour exécuter des requêtes
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Fonction pour exécuter INSERT/UPDATE/DELETE
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

module.exports = {
  query,
  run,
  db
};