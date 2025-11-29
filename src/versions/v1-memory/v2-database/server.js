const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importez vos fichiers existants
const userRoutes = require('../../routes/users');

const app = express();
const PORT = 6000;

app.use(cors());
app.use(express.json());

// Utilisez vos routes existantes
app.use('/api/users', userRoutes);

// Route de santé
app.get('/health', async (req, res) => {
  try {
    const { query } = require('../../config/database');
    await query('SELECT 1');
    res.json({ 
      status: 'OK',
      database: 'SQLite',
      version: 'v2-database',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'SQLite - Connection failed',
      error: error.message
    });
  }
});

// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: '🎯 TASK 5: API User REST (Database)',
    version: 'v2-database', 
    port: PORT,
    endpoints: {
      'GET /api/users': 'Récupérer tous les utilisateurs',
      'GET /api/users/:id': 'Récupérer un utilisateur par ID',
      'POST /api/users': 'Créer un nouvel utilisateur',
      'PUT /api/users/:id': 'Mettre à jour un utilisateur',
      'DELETE /api/users/:id': 'Supprimer un utilisateur',
      'GET /health': 'Statut de la base de données'
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🎯 TASK 5 - API Database démarrée sur le port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});