-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    parent_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    child_class VARCHAR(100) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0), -- en minutes
    meeting_type VARCHAR(20) NOT NULL CHECK (meeting_type IN ('in_person', 'video_call', 'phone_call')),
    location VARCHAR(500), -- optionnel, pour les rendez-vous en personne
    urgency VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    
    -- Informations de réponse de l'admin
    admin_notes TEXT,
    admin_response VARCHAR(20) CHECK (admin_response IN ('approved', 'rejected')),
    admin_response_date TIMESTAMP,
    admin_id VARCHAR(255),
    admin_name VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index pour améliorer les performances
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_urgency (urgency),
    INDEX idx_meeting_type (meeting_type),
    INDEX idx_preferred_date (preferred_date),
    INDEX idx_created_at (created_at)
);

-- Table des logs de suppression (optionnelle, pour tracer les suppressions)
CREATE TABLE IF NOT EXISTS meeting_deletion_logs (
    id SERIAL PRIMARY KEY,
    meeting_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    reason TEXT,
    deleted_by VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON meetings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion de données de test (optionnel)
INSERT INTO meetings (
    parent_id,
    parent_name,
    parent_email,
    parent_phone,
    child_name,
    child_class,
    subject,
    description,
    preferred_date,
    preferred_time,
    duration,
    meeting_type,
    location,
    urgency,
    status
) VALUES 
(
    'parent1',
    'Marie Dupont',
    'marie.dupont@email.com',
    '06 12 34 56 78',
    'Lucas Dupont',
    '4ème A',
    'Problèmes de comportement',
    'Mon fils a des difficultés à se concentrer en classe et semble avoir des problèmes avec certains camarades. J''aimerais discuter de la situation avec vous.',
    '2024-12-25',
    '14:00:00',
    30,
    'in_person',
    'Bureau du directeur',
    'medium',
    'pending'
),
(
    'parent2',
    'Jean Martin',
    'jean.martin@email.com',
    '06 98 76 54 32',
    'Emma Martin',
    '6ème B',
    'Suivi scolaire',
    'Je souhaite faire le point sur les progrès de ma fille et discuter de ses résultats récents.',
    '2024-12-26',
    '16:00:00',
    45,
    'video_call',
    NULL,
    'low',
    'pending'
),
(
    'parent3',
    'Sophie Bernard',
    'sophie.bernard@email.com',
    '06 11 22 33 44',
    'Thomas Bernard',
    '5ème C',
    'Situation urgente',
    'Mon fils a été victime de harcèlement. J''ai besoin d''une réunion en urgence pour résoudre cette situation.',
    '2024-12-21',
    '09:00:00',
    60,
    'in_person',
    'Salle de réunion',
    'urgent',
    'pending'
),
(
    'parent4',
    'Pierre Leroy',
    'pierre.leroy@email.com',
    '06 55 66 77 88',
    'Léa Leroy',
    '3ème A',
    'Orientation post-3ème',
    'Je voudrais discuter de l''orientation de ma fille pour l''année prochaine et des options qui s''offrent à elle.',
    '2024-12-27',
    '17:00:00',
    30,
    'phone_call',
    NULL,
    'medium',
    'approved'
),
(
    'parent5',
    'Isabelle Moreau',
    'isabelle.moreau@email.com',
    '06 99 88 77 66',
    'Alexandre Moreau',
    '4ème B',
    'Absences répétées',
    'Mon fils a eu plusieurs absences ces dernières semaines. Je voudrais comprendre la situation et voir comment l''aider.',
    '2024-12-24',
    '13:00:00',
    45,
    'in_person',
    'Bureau du CPE',
    'high',
    'rejected'
)
ON CONFLICT DO NOTHING;
