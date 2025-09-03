-- =====================================================
-- SCRIPT DE NETTOYAGE ET OPTIMISATION DE LA BASE CHRONO_CARTO
-- VERSION CORRIGÉE - NE SUPPRIME QUE CE QUI EST VRAIMENT INUTILE
-- =====================================================

-- 1. SUPPRESSION DES TABLES VRAIMENT NON NÉCESSAIRES
-- =====================================================

-- Supprimer les tables de suggestions et votes (pas utilisés)
DROP TABLE IF EXISTS `votes`;
DROP TABLE IF EXISTS `suggestions`;

-- Supprimer les tables de progression et préférences (pas utilisés)
DROP TABLE IF EXISTS `student_progress`;
DROP TABLE IF EXISTS `user_preferences`;

-- Supprimer la table de logs d'activité (trop verbeuse)
DROP TABLE IF EXISTS `activity_logs`;

-- Supprimer la table de sessions utilisateur (pas implémentée)
DROP TABLE IF EXISTS `user_sessions`;

-- 2. NETTOYAGE DES COLONNES NON NÉCESSAIRES
-- =====================================================

-- Nettoyer la table users (colonnes de vérification redondantes)
-- Utiliser des commandes ALTER TABLE séparées pour MySQL

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

-- NE PAS SUPPRIMER is_approved - COLONNE ESSENTIELLE POUR LA SÉCURITÉ
-- Cette colonne contrôle l'accès au système (seuls les utilisateurs approuvés peuvent se connecter)
SELECT 'Colonne is_approved CONSERVÉE - ESSENTIELLE POUR LA SÉCURITÉ' as info;

-- Nettoyer la table parents (colonnes non utilisées)
-- Supprimer address si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'parents' 
     AND COLUMN_NAME = 'address') > 0,
    'ALTER TABLE `parents` DROP COLUMN `address`',
    'SELECT "Colonne address n\'existe pas dans parents"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer occupation si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'parents' 
     AND COLUMN_NAME = 'occupation') > 0,
    'ALTER TABLE `parents` DROP COLUMN `occupation`',
    'SELECT "Colonne occupation n\'existe pas dans parents"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Nettoyer la table students (colonnes non utilisées)
-- Supprimer address si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'address') > 0,
    'ALTER TABLE `students` DROP COLUMN `address`',
    'SELECT "Colonne address n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer progress_percentage si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'progress_percentage') > 0,
    'ALTER TABLE `students` DROP COLUMN `progress_percentage`',
    'SELECT "Colonne progress_percentage n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer total_quiz_attempts si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'total_quiz_attempts') > 0,
    'ALTER TABLE `students` DROP COLUMN `total_quiz_attempts`',
    'SELECT "Colonne total_quiz_attempts n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer average_score si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'average_score') > 0,
    'ALTER TABLE `students` DROP COLUMN `average_score`',
    'SELECT "Colonne average_score n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer last_activity si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'last_activity') > 0,
    'ALTER TABLE `students` DROP COLUMN `last_activity`',
    'SELECT "Colonne last_activity n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer birth_date si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'birth_date') > 0,
    'ALTER TABLE `students` DROP COLUMN `birth_date`',
    'SELECT "Colonne birth_date n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer paid_sessions si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'paid_sessions') > 0,
    'ALTER TABLE `students` DROP COLUMN `paid_sessions`',
    'SELECT "Colonne paid_sessions n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Supprimer unpaid_sessions si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'unpaid_sessions') > 0,
    'ALTER TABLE `students` DROP COLUMN `unpaid_sessions`',
    'SELECT "Colonne unpaid_sessions n\'existe pas dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. AJOUT DES COLONNES MANQUANTES
-- =====================================================

-- Ajouter first_name et last_name dans parents
-- Vérifier et ajouter first_name si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'parents' 
     AND COLUMN_NAME = 'first_name') = 0,
    'ALTER TABLE `parents` ADD COLUMN `first_name` VARCHAR(100) NOT NULL DEFAULT ""',
    'SELECT "Colonne first_name existe déjà dans parents"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter last_name si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'parents' 
     AND COLUMN_NAME = 'last_name') = 0,
    'ALTER TABLE `parents` ADD COLUMN `last_name` VARCHAR(100) NOT NULL DEFAULT ""',
    'SELECT "Colonne last_name existe déjà dans parents"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter class_level si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'parents' 
     AND COLUMN_NAME = 'class_level') = 0,
    'ALTER TABLE `parents` ADD COLUMN `class_level` ENUM("Terminale groupe 1","Terminale groupe 2","Terminale groupe 3","Terminale groupe 4","1ère groupe 1","1ère groupe 2","1ère groupe 3") DEFAULT NULL',
    'SELECT "Colonne class_level existe déjà dans parents"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter first_name et last_name dans students
-- Vérifier et ajouter first_name si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'first_name') = 0,
    'ALTER TABLE `students` ADD COLUMN `first_name` VARCHAR(100) NOT NULL DEFAULT ""',
    'SELECT "Colonne first_name existe déjà dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter last_name si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'students' 
     AND COLUMN_NAME = 'last_name') = 0,
    'ALTER TABLE `students` ADD COLUMN `last_name` VARCHAR(100) NOT NULL DEFAULT ""',
    'SELECT "Colonne last_name existe déjà dans students"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. MISE À JOUR DES DONNÉES EXISTANTES
-- =====================================================

-- Mettre à jour les noms dans parents depuis users
UPDATE `parents` p 
JOIN `users` u ON p.user_id = u.id 
SET 
    p.first_name = u.first_name,
    p.last_name = u.last_name;

-- Mettre à jour les noms dans students depuis users
UPDATE `students` s 
JOIN `users` u ON s.user_id = u.id 
SET 
    s.first_name = u.first_name,
    s.last_name = u.last_name;

-- Déterminer la classe du parent basée sur ses enfants
UPDATE `parents` p 
JOIN `parent_student` ps ON p.id = ps.parent_id
JOIN `students` s ON ps.student_id = s.id
SET p.class_level = s.class_level
WHERE p.class_level IS NULL;

-- 5. OPTIMISATION DE LA TABLE rendez_vous
-- =====================================================

-- Ajouter des colonnes pour les IDs entiers
-- Vérifier et ajouter parent_id_int si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'rendez_vous' 
     AND COLUMN_NAME = 'parent_id_int') = 0,
    'ALTER TABLE `rendez_vous` ADD COLUMN `parent_id_int` INT DEFAULT NULL',
    'SELECT "Colonne parent_id_int existe déjà dans rendez_vous"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter child_id_int si elle n'existe pas
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chrono_carto' 
     AND TABLE_NAME = 'rendez_vous' 
     AND COLUMN_NAME = 'child_id_int') = 0,
    'ALTER TABLE `rendez_vous` ADD COLUMN `child_id_int` INT DEFAULT NULL',
    'SELECT "Colonne child_id_int existe déjà dans rendez_vous"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Mettre à jour les IDs entiers
UPDATE `rendez_vous` rv
JOIN `parents` p ON rv.parent_id = p.id OR rv.parent_id = p.user_id
SET rv.parent_id_int = p.id;

UPDATE `rendez_vous` rv
JOIN `students` s ON rv.child_name LIKE CONCAT('%', s.first_name, '%') OR rv.child_name LIKE CONCAT('%', s.last_name, '%')
SET rv.child_id_int = s.id
WHERE rv.child_id_int IS NULL;

-- 6. NETTOYAGE DES TRIGGERS ET VUES
-- =====================================================

-- Supprimer les triggers non nécessaires
DROP TRIGGER IF EXISTS `update_content_counters`;
DROP TRIGGER IF EXISTS `update_student_stats_after_quiz`;
DROP TRIGGER IF EXISTS `update_suggestion_votes_count`;
DROP TRIGGER IF EXISTS `after_user_insert`;

-- Supprimer les vues non nécessaires
DROP VIEW IF EXISTS `content_by_subject`;
DROP VIEW IF EXISTS `student_stats`;

-- 7. CRÉATION D'UN NOUVEAU TRIGGER UTILE
-- =====================================================

DELIMITER $$
CREATE TRIGGER `after_user_insert_clean` AFTER INSERT ON `users` FOR EACH ROW 
BEGIN
    IF NEW.role = 'student' THEN
        INSERT INTO students (user_id, first_name, last_name, class_level, parent_id)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NULL, NULL);
    ELSEIF NEW.role = 'parent' THEN
        INSERT INTO parents (user_id, first_name, last_name, phone_number, class_level)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.phone, NULL);
    END IF;
END$$
DELIMITER ;

-- 8. VÉRIFICATION ET AFFICHAGE DES RÉSULTATS
-- =====================================================

-- Afficher la structure finale
SELECT '=== STRUCTURE FINALE ===' as info;
SHOW TABLES;

-- Afficher les données des parents
SELECT '=== DONNÉES DES PARENTS ===' as info;
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.phone_number,
    p.class_level,
    COUNT(ps.student_id) as nb_enfants
FROM parents p
LEFT JOIN parent_student ps ON p.id = ps.parent_id
GROUP BY p.id;

-- Afficher les données des étudiants
SELECT '=== DONNÉES DES ÉTUDIANTS ===' as info;
SELECT 
    s.id,
    s.first_name,
    s.last_name,
    s.class_level,
    s.phone_number,
    p.first_name as parent_first_name,
    p.last_name as parent_last_name
FROM students s
LEFT JOIN parent_student ps ON s.id = ps.student_id
LEFT JOIN parents p ON ps.parent_id = p.id;

-- Afficher les rendez-vous
SELECT '=== RENDEZ-VOUS ===' as info;
SELECT 
    rv.id,
    rv.parent_name,
    rv.child_name,
    rv.status,
    rv.timing
FROM rendez_vous rv
LIMIT 5;

-- Afficher les tables conservées importantes
SELECT '=== TABLES CONSERVÉES (FONCTIONNALITÉS IMPORTANTES) ===' as info;
SELECT 
    'conversations, messages, notifications' as messaging_system,
    'quizzes, quiz_questions, quiz_attempts, student_answers' as quiz_system,
    'courses, content, files, videos' as content_system,
    'parents, students, users, parent_student' as user_management,
    'attendance, paiement, rendez_vous' as core_features;

SELECT '=== NETTOYAGE TERMINÉ ===' as info;
