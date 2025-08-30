DELIMITER $$

DROP TRIGGER IF EXISTS trigger_presence_paiement$$
CREATE TRIGGER trigger_presence_paiement
AFTER INSERT ON attendance
FOR EACH ROW
BEGIN
    DECLARE v_parent_id INT; -- ⚡ déclaration déplacée en haut du bloc

    IF NEW.is_present = 1 THEN
        SELECT parent_id INTO v_parent_id 
        FROM parent_student 
        WHERE student_id = NEW.student_id 
        LIMIT 1;
        
        IF v_parent_id IS NOT NULL THEN
            CALL UpdatePaiementOnPresence(NEW.student_id, v_parent_id, NEW.session_date);
        END IF;
    END IF;
END$$

DELIMITER ;
