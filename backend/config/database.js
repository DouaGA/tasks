const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion SQLite:', err.message);
  } else {
    console.log('✅ Connecté à la base SQLite.');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Erreur création table:', err.message);
    } else {
      console.log('✅ Table users prête.');
      
      // Insérer des données de test
      const testUsers = [
        ['Jean Dupont', 'jean.dupont@email.com', 30],
        ['Marie Martin', 'marie.martin@email.com', 25],
        ['Pierre Durand', 'pierre.durand@email.com', 35]
      ];
      
      testUsers.forEach(user => {
        db.run(
          'INSERT OR IGNORE INTO users (name, email, age) VALUES (?, ?, ?)',
          user,
          (err) => {
            if (err) console.error('❌ Erreur insertion:', err.message);
          }
        );
      });
    }
  });
}

module.exports = db;