-- Migration pour la table rendez_vous
-- Ajouter les colonnes de référence pour les vraies données

-- Ajouter la colonne child_id pour référencer la table students
ALTER TABLE rendez_vous
ADD COLUMN child_id INTEGER NULL;

-- Ajouter la colonne parent_id_int pour convertir parent_id en INTEGER
ALTER TABLE rendez_vous
ADD COLUMN parent_id_int INTEGER NULL;

-- Créer des index sur les nouvelles colonnes
CREATE INDEX idx_rendez_vous_child_id ON rendez_vous(child_id);
CREATE INDEX idx_rendez_vous_parent_id_int ON rendez_vous(parent_id_int);

-- Mettre à jour les données existantes pour parent_id_int (exemple, à adapter si nécessaire)
-- UPDATE rendez_vous SET parent_id_int = CAST(parent_id AS UNSIGNED) WHERE parent_id IS NOT NULL;

-- Ajouter des contraintes de clé étrangère (optionnel, pour la cohérence)
-- Assurez-vous que les tables `users` et `students` existent avec une colonne `id` avant d'exécuter
-- ALTER TABLE rendez_vous
-- ADD CONSTRAINT fk_rendez_vous_parent FOREIGN KEY (parent_id_int) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE rendez_vous
-- ADD CONSTRAINT fk_rendez_vous_child FOREIGN KEY (child_id) REFERENCES students(id) ON DELETE SET NULL ON UPDATE CASCADE;