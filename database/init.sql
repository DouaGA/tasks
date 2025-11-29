-- Créer la base de données
CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer des données de test
INSERT INTO users (name, email, age) VALUES
('Jean Dupont', 'jean.dupont@email.com', 30),
('Marie Martin', 'marie.martin@email.com', 25),
('Pierre Durand', 'pierre.durand@email.com', 35),
('Sophie Lambert', 'sophie.lambert@email.com', 28);

-- Vérifier les données
SELECT * FROM users;