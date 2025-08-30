-- Créer la table de présence
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  session_date DATE NOT NULL,
  is_present BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_date (student_id, session_date)
);

-- Ajouter les colonnes pour les séances payées/non payées dans la table students
ALTER TABLE students 
ADD COLUMN paid_sessions INT DEFAULT 0,
ADD COLUMN unpaid_sessions INT DEFAULT 0;

-- Créer un index pour optimiser les requêtes de présence
CREATE INDEX idx_attendance_student_date ON attendance(student_id, session_date);
CREATE INDEX idx_attendance_date ON attendance(session_date);

-- Insérer quelques données de test pour aujourd'hui
INSERT INTO attendance (student_id, session_date, is_present) VALUES
(68, CURDATE(), FALSE),
(69, CURDATE(), FALSE),
(70, CURDATE(), FALSE)
ON DUPLICATE KEY UPDATE is_present = VALUES(is_present);
