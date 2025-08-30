-- Table des Rendez-vous - Chrono-Carto
-- Compatible MySQL 8+

CREATE TABLE IF NOT EXISTS rendez_vous (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    child_class VARCHAR(100) NOT NULL,
    timing DATETIME NOT NULL, -- Date et heure du rendez-vous
    parent_reason TEXT NOT NULL, -- Raison du parent pour le rendez-vous
    admin_reason TEXT, -- Raison de l'admin (acceptation/refus)
    status ENUM('pending','approved','refused','cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index (pas de IF NOT EXISTS en MySQL)
CREATE INDEX idx_rendez_vous_parent_id ON rendez_vous(parent_id);
CREATE INDEX idx_rendez_vous_status ON rendez_vous(status);
CREATE INDEX idx_rendez_vous_timing ON rendez_vous(timing);
CREATE INDEX idx_rendez_vous_created_at ON rendez_vous(created_at);

-- Table des logs de suppression
CREATE TABLE IF NOT EXISTS rendez_vous_deletion_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rendez_vous_id INT NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    parent_reason TEXT NOT NULL,
    admin_reason TEXT,
    deleted_by VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pas besoin de trigger update : MySQL gère updated_at avec ON UPDATE

-- Insertion de données de test
INSERT IGNORE INTO rendez_vous (
    parent_id,
    parent_name,
    parent_email,
    parent_phone,
    child_name,
    child_class,
    timing,
    parent_reason,
    status
) VALUES 
(
    'parent1',
    'Marie Dupont',
    'marie.dupont@email.com',
    '06 12 34 56 78',
    'Lucas Dupont',
    '4ème A',
    '2024-12-25 14:00:00',
    'Mon fils a des difficultés à se concentrer en classe et semble avoir des problèmes avec certains camarades. J''aimerais discuter de la situation avec vous.',
    'pending'
),
(
    'parent2',
    'Jean Martin',
    'jean.martin@email.com',
    '06 98 76 54 32',
    'Emma Martin',
    '6ème B',
    '2024-12-26 16:00:00',
    'Je souhaite faire le point sur les progrès de ma fille et discuter de ses résultats récents.',
    'pending'
),
(
    'parent3',
    'Sophie Bernard',
    'sophie.bernard@email.com',
    '06 11 22 33 44',
    'Thomas Bernard',
    '5ème C',
    '2024-12-21 09:00:00',
    'Mon fils a été victime de harcèlement. J''ai besoin d''une réunion en urgence pour résoudre cette situation.',
    'pending'
),
(
    'parent4',
    'Pierre Leroy',
    'pierre.leroy@email.com',
    '06 55 66 77 88',
    'Léa Leroy',
    '3ème A',
    '2024-12-27 17:00:00',
    'Je voudrais discuter de l''orientation de ma fille pour l''année prochaine et des options qui s''offrent à elle.',
    'approved'
),
(
    'parent5',
    'Isabelle Moreau',
    'isabelle.moreau@email.com',
    '06 99 88 77 66',
    'Alexandre Moreau',
    '4ème B',
    '2024-12-24 13:00:00',
    'Mon fils a eu plusieurs absences ces dernières semaines. Je voudrais comprendre la situation et voir comment l''aider.',
    'refused'
);
