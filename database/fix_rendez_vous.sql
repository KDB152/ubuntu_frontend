-- Script pour corriger la table rendez_vous
-- Exécutez ce script dans votre base de données MySQL

USE chrono_carto;

-- Vérifier la structure actuelle
DESCRIBE rendez_vous;

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE rendez_vous ADD COLUMN IF NOT EXISTS child_id INT NULL AFTER parent_id;
ALTER TABLE rendez_vous ADD COLUMN IF NOT EXISTS parent_id_int INT NULL AFTER parent_id;

-- Créer des index
CREATE INDEX IF NOT EXISTS idx_rendez_vous_child_id ON rendez_vous(child_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_parent_id_int ON rendez_vous(parent_id_int);

-- Mettre à jour parent_id_int pour les données existantes
UPDATE rendez_vous 
SET parent_id_int = CAST(parent_id AS UNSIGNED) 
WHERE parent_id REGEXP '^[0-9]+$' 
AND parent_id_int IS NULL;

-- Afficher la structure finale
DESCRIBE rendez_vous;
