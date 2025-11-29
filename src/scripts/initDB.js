const { Pool } = require('pg');
require('dotenv').config();

const init = async () => {
  let pool;
  
  try {
    // Se connecter à PostgreSQL
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres' // Base par défaut
    });

    const client = await pool.connect();
    
    try {
      // Créer la base de données si elle n'existe pas
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Base de données ${process.env.DB_NAME} créée`);
    } catch (error) {
      if (error.code === '42P04') { // Database already exists
        console.log(`✅ Base de données ${process.env.DB_NAME} existe déjà`);
      } else {
        throw error;
      }
    } finally {
      client.release();
    }

    // Se connecter à la nouvelle base
    const userPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const userClient = await userPool.connect();
    
    try {
      // Créer la table users
      await userClient.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Table users créée');

      // Créer un index pour l'email
      await userClient.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
      `);
      console.log('✅ Index email créé');

      // Insérer des données de test
      await userClient.query(`
        INSERT INTO users (name, email, age) VALUES
          ('John Doe', 'john@example.com', 30),
          ('Jane Smith', 'jane@example.com', 25),
          ('Bob Johnson', 'bob@example.com', 35)
        ON CONFLICT (email) DO NOTHING
      `);
      console.log('✅ Données de test insérées');

    } finally {
      userClient.release();
      await userPool.end();
    }

  } catch (error) {
    console.error('❌ Erreur lors de l initialisation:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
};

init();