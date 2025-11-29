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
  // Table users avec authentification
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    age INTEGER,
    role TEXT DEFAULT 'user',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Erreur création table users:', err.message);
    } else {
      console.log('✅ Table users prête.');
      insertSampleData();
    }
  });
}

function insertSampleData() {
  // Données d'exemple (sans mot de passe pour les démos)
  const sampleUsers = [
    ['Jean Dupont', 'jean.dupont@email.com', null, 30, 'user'],
    ['Marie Martin', 'marie.martin@email.com', null, 25, 'user'],
    ['Admin System', 'admin@system.com', null, 35, 'admin'],
    ['Pierre Durand', 'pierre.durand@email.com', null, 28, 'user']
  ];
  
  sampleUsers.forEach(user => {
    db.run(
      'INSERT OR IGNORE INTO users (name, email, password, age, role) VALUES (?, ?, ?, ?, ?)',
      user,
      (err) => {
        if (err && !err.message.includes('UNIQUE constraint failed')) {
          console.error('❌ Erreur insertion:', err.message);
        }
      }
    );
  });
}

module.exports = db;