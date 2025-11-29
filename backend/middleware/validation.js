const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  
  // Validation du nom
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Le nom est requis' });
  }
  
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Le nom doit contenir entre 2 et 100 caractères' });
  }
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  
  // Validation de l'âge
  if (age && (age < 0 || age > 150)) {
    return res.status(400).json({ error: 'L\'âge doit être entre 0 et 150' });
  }
  
  next();
};

module.exports = { validateUser };