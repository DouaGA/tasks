const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token JWT invalide'
    });
  }

  // Erreur d'expiration JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token JWT expiré'
    });
  }

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Erreur par défaut
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
};

module.exports = errorHandler;