-- =====================================================
-- Script pour vérifier et corriger la table users
-- =====================================================

-- 1. Vérifier la structure de la table users
DESCRIBE users;

-- 2. Vérifier si la colonne role existe
SHOW COLUMNS FROM users LIKE 'role';

-- 3. Ajouter la colonne role si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('student', 'parent', 'admin') DEFAULT NULL;

-- 4. Voir les données actuelles
SELECT id, first_name, last_name, email, role FROM users LIMIT 10;

-- 5. Mettre à jour les rôles pour les étudiants
UPDATE users u
JOIN students s ON u.id = s.user_id
SET u.role = 'student'
WHERE u.role IS NULL OR u.role = '';

-- 6. Mettre à jour les rôles pour les parents
UPDATE users u
JOIN parents p ON u.id = p.user_id
SET u.role = 'parent'
WHERE u.role IS NULL OR u.role = '';

-- 7. Vérifier le résultat
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.role,
    CASE 
        WHEN s.id IS NOT NULL THEN 'Étudiant'
        WHEN p.id IS NOT NULL THEN 'Parent'
        ELSE 'Autre'
    END as type_utilisateur
FROM users u
LEFT JOIN students s ON u.id = s.user_id
LEFT JOIN parents p ON u.id = p.user_id
ORDER BY u.role, u.first_name;

-- 8. Compter par rôle
SELECT 
    role,
    COUNT(*) as nombre
FROM users 
GROUP BY role;

-- 9. Vérifier les étudiants sans rôle
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    s.id as student_id,
    s.class_level
FROM users u
JOIN students s ON u.id = s.user_id
WHERE u.role IS NULL OR u.role = '';

-- 10. Vérifier les parents sans rôle
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    p.id as parent_id
FROM users u
JOIN parents p ON u.id = p.user_id
WHERE u.role IS NULL OR u.role = '';
