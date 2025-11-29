const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import des routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes API
app.use('/api', userRoutes);
app.use('/api', authRoutes);

// Route de bienvenue
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API User Management Full Stack - Démarrage réussi!',
    version: '1.0.0',
    endpoints: {
      'Authentication': {
        'POST /api/auth/register': 'Inscription utilisateur',
        'POST /api/auth/login': 'Connexion utilisateur',
        'GET /api/auth/me': 'Profil utilisateur'
      },
      'Users': {
        'GET /api/users': 'Liste des utilisateurs',
        'GET /api/users/search?q=query': 'Recherche utilisateurs',
        'GET /api/users/stats': 'Statistiques',
        'GET /api/users/:id': 'Détails utilisateur',
        'POST /api/users': 'Créer utilisateur (auth)',
        'PUT /api/users/:id': 'Modifier utilisateur (auth)',
        'DELETE /api/users/:id': 'Supprimer utilisateur (auth)'
      }
    },
    database: 'SQLite',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SERVEUR FULL STACK DÉMARRÉ AVEC SUCCÈS!');
  console.log('='.repeat(50));
  console.log(`📊 Backend URL: http://localhost:${PORT}`);
  console.log(`🛠️  Environnement: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Base de données: SQLite`);
  console.log(`🔐 Authentification: JWT activée`);
  console.log('='.repeat(50));
  console.log('📋 Endpoints disponibles:');
  console.log('   GET  /              - Page d\'accueil API');
  console.log('   GET  /api/users     - Liste utilisateurs');
  console.log('   POST /api/auth/login - Connexion');
  console.log('='.repeat(50));
});

module.exports = app;