const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ========== TASK 4: DONNÉES MÉMOIRE ==========
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

// ========== ENDPOINTS CRUD (MEMORY) ==========

// GET /api/users - Récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users,
    version: 'v1-memory'
  });
});

// GET /api/users/:id - Récupérer un utilisateur par ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Utilisateur non trouvé'
    });
  }
  
  res.json({
    success: true,
    data: user,
    version: 'v1-memory'
  });
});

// POST /api/users - Créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email || !age) {
    return res.status(400).json({
      success: false,
      error: 'Tous les champs (name, email, age) sont requis'
    });
  }
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'Un utilisateur avec cet email existe déjà'
    });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    age: parseInt(age)
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'Utilisateur créé avec succès',
    data: newUser,
    version: 'v1-memory'
  });
});

// PUT /api/users/:id - Mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, age } = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Utilisateur non trouvé'
    });
  }
  
  if (email && email !== users[userIndex].email) {
    const emailExists = users.some(u => u.email === email && u.id !== userId);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        error: 'Un autre utilisateur avec cet email existe déjà'
      });
    }
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    age: age ? parseInt(age) : users[userIndex].age
  };
  
  res.json({
    success: true,
    message: 'Utilisateur mis à jour avec succès',
    data: users[userIndex],
    version: 'v1-memory'
  });
});

// DELETE /api/users/:id - Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Utilisateur non trouvé'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Utilisateur supprimé avec succès',
    data: deletedUser,
    version: 'v1-memory'
  });
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: '🎯 TASK 4: API User REST (Memory)',
    version: 'v1-memory',
    port: PORT,
    endpoints: {
      'GET /api/users': 'Récupérer tous les utilisateurs',
      'GET /api/users/:id': 'Récupérer un utilisateur par ID',
      'POST /api/users': 'Créer un nouvel utilisateur',
      'PUT /api/users/:id': 'Mettre à jour un utilisateur',
      'DELETE /api/users/:id': 'Supprimer un utilisateur'
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🎯 TASK 4 - API Memory démarrée sur le port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}`);
});