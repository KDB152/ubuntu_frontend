-- =====================================================
-- SCRIPT DE CORRECTION DE LA TABLE USERS
-- Suppression des colonnes problématiques une par une
-- =====================================================

USE chrono_carto;

-- 1. SUPPRESSION DES COLONNES UNE PAR UNE
-- =====================================================

-- Supprimer email_verification_code si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'users' 
     AND COLUMN_NAME = 'email_verification_code') > 0,
    'ALTER TABLE `users` DROP COLUMN `email_verification_code`',
    'SELECT "Colonne email_verification_code n\'existe pas"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer verification_token_expiry si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'users' 
     AND COLUMN_NAME = 'verification_token_expiry') > 0,
    'ALTER TABLE `users` DROP COLUMN `verification_token_expiry`',
    'SELECT "Colonne verification_token_expiry n\'existe pas"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer password_reset_code si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'users' 
     AND COLUMN_NAME = 'password_reset_code') > 0,
    'ALTER TABLE `users` DROP COLUMN `password_reset_code`',
    'SELECT "Colonne password_reset_code n\'existe pas"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer password_reset_code_expiry si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'users' 
     AND COLUMN_NAME = 'password_reset_code_expiry') > 0,
    'ALTER TABLE `users` DROP COLUMN `password_reset_code_expiry`',
    'SELECT "Colonne password_reset_code_expiry n\'existe pas"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer is_approved si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'users' 
     AND COLUMN_NAME = 'is_approved') > 0,
    'ALTER TABLE `users` DROP COLUMN `is_approved`',
    'SELECT "Colonne is_approved n\'existe pas"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. VÉRIFICATION DE LA STRUCTURE FINALE
-- =====================================================

-- Afficher la structure finale de la table users
SELECT '=== STRUCTURE FINALE DE LA TABLE USERS ===' as info;
DESCRIBE users;

-- Afficher les colonnes restantes
SELECT '=== COLONNES RESTANTES ===' as info;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'chrono_carto' 
AND TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;

SELECT '=== CORRECTION TERMINÉE ===' as info;
