-- Ajouter la colonne role à la table users si elle n'existe pas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('student', 'parent', 'admin', 'super_admin') DEFAULT 'student';

-- Mettre à jour les rôles des utilisateurs existants
-- Étudiants (ceux qui ont un enregistrement dans la table students)
UPDATE users u 
JOIN students s ON u.id = s.user_id 
SET u.role = 'student';

-- Parents (ceux qui ont un enregistrement dans la table parents)
UPDATE users u 
JOIN parents p ON u.id = p.user_id 
SET u.role = 'parent';

-- Admins (mettre à jour manuellement selon vos besoins)
-- Exemple: UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

-- Vérifier les données
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.email,
  u.role,
  CASE 
    WHEN s.id IS NOT NULL THEN 'Étudiant'
    WHEN p.id IS NOT NULL THEN 'Parent'
    ELSE 'Utilisateur'
  END as type_utilisateur
FROM users u
LEFT JOIN students s ON u.id = s.user_id
LEFT JOIN parents p ON u.id = p.user_id
ORDER BY u.role, u.last_name;
