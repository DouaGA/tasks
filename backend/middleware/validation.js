const validateUser = (req, res, next) => {
  const { name, email, age, password } = req.body;
  const errors = [];

  // Validation du nom
  if (!name || name.trim().length === 0) {
    errors.push('Le nom est requis');
  } else if (name.length < 2 || name.length > 100) {
    errors.push('Le nom doit contenir entre 2 et 100 caractères');
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Email invalide');
  }

  // Validation de l'âge
  if (age && (age < 0 || age > 150)) {
    errors.push('L\'âge doit être entre 0 et 150');
  }

  // Validation du mot de passe (seulement pour l'inscription)
  if (req.path.includes('register') && (!password || password.length < 6)) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  next();
};

module.exports = { validateUser };