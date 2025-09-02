-- Script pour ajouter les colonnes manquantes à la table rendez_vous
-- Exécutez ce script dans votre base de données MySQL

USE chrono_carto;

-- Ajouter la colonne child_id pour référencer la table students
ALTER TABLE rendez_vous ADD COLUMN child_id INT NULL AFTER parent_id;

-- Ajouter la colonne parent_id_int pour convertir parent_id en INT
ALTER TABLE rendez_vous ADD COLUMN parent_id_int INT NULL AFTER parent_id;

-- Créer des index sur les nouvelles colonnes
CREATE INDEX idx_rendez_vous_child_id ON rendez_vous(child_id);
CREATE INDEX idx_rendez_vous_parent_id_int ON rendez_vous(parent_id_int);

-- Mettre à jour les parent_id existants pour qu'ils soient des entiers (si possible)
UPDATE rendez_vous 
SET parent_id_int = CAST(parent_id AS UNSIGNED) 
WHERE parent_id REGEXP '^[0-9]+$' 
AND parent_id_int IS NULL;

-- Afficher la structure de la table après modification
DESCRIBE rendez_vous;
