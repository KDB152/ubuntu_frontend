-- Script d'insertion de données de test pour la table rendez_vous
-- Exécutez ce script dans votre base de données MySQL

USE chrono_carto;

-- Supprimer les données existantes (optionnel)
-- DELETE FROM rendez_vous;

-- Insérer des données de test
INSERT INTO rendez_vous (
    parent_id,
    parent_name,
    parent_email,
    parent_phone,
    child_name,
    child_class,
    timing,
    parent_reason,
    admin_reason,
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
    NULL,
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
    NULL,
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
    NULL,
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
    'Rendez-vous approuvé. Nous discuterons des options d''orientation disponibles.',
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
    'Nous avons déjà discuté de cette situation lors du dernier rendez-vous. Contactez le CPE pour plus d''informations.',
    'refused'
);

-- Vérifier que les données ont été insérées
SELECT * FROM rendez_vous ORDER BY created_at DESC;
