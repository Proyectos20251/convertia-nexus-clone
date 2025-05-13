
-- Insert remaining employees
INSERT INTO public.organization_employees (first_name, last_name, status, employment_type, email, work_location, department, team, position)
VALUES
  ('FRANCISCO', 'CASTILLO', 'Activo', 'Interno', 'francisco@conver.com', 'España', 'AdTech', null, 'EXECUTIVE ACCOUNT CONSULTANT'),
  ('EDUARDO', 'CONTRERAS', 'Activo', 'Interno', 'eduardo@conver.com', 'México', 'Talent & Culture', null, 'INTERNAL COMMUNICATION SPECIALIST SR'),
  ('DIEGO', 'CORONA', 'Activo', 'Interno', 'diego@conver.com', 'México', 'Administration & Finance', null, 'FINANCIAL ACCOUNTING COORDINATOR'),
  ('ISHTAR', 'CORREA', 'Activo', 'Interno', 'ishtar@conver.com', 'México', 'AdTech', null, 'PROJECT MANAGER'),
  ('MARIA', 'CORSINO', 'Activo', 'Interno', 'mcorsino@inconcertcc@conver.com', 'Uruguay', 'Administration & Finance', 'Finance', 'FINANCE ANALYST'),
  ('MIGUEL', 'CORTES', 'Activo', 'Interno', 'miguel@conver.com', 'México', 'IT', 'Support', 'SUPPORT ENGINEER'),
  ('NIDIA', 'CORTES', 'Activo', 'Interno', 'nidia@conver.com', 'Colombia', 'Marketing', 'Performance', 'MARKETING MANAGER'),
  ('GUADALUPE', 'CORTEZ', 'Activo', 'Interno', 'guadalupe@conver.com', 'México', 'AdTech', null, 'CUSTOMER SUCCESS SPECIALIST'),
  ('ALBA', 'DE', 'Activo', 'Interno', 'alba@conver.com', 'España', 'Corporate Communications & Branding', null, 'GRAPHIC AND WEB DESIGNER'),
  ('AGUSTINA', 'DI', 'Activo', 'Interno', 'agustina@conver.com', 'Uruguay', 'Administration & Finance', 'Accounting', 'ACCOUNTING ANALYST'),
  ('JAVIER', 'FERNANDEZ', 'Activo', 'Interno', 'javier@conver.com', 'México', 'AdTech', null, 'TECHNOLOGY COMMERCIAL VP'),
  ('ANDRES', 'FERNANDEZ', 'Activo', 'Interno', 'andres@conver.com', 'Colombia', 'Marketing', null, 'TRAFFICKER DIGITAL'),
  ('ALBERTO', 'FERNANDEZ', 'Activo', 'Interno', 'alberto@conver.com', 'España', 'Administration & Finance', 'Finance', 'FINANCE ANALYST'),
  ('INES', 'FERREIRA', 'Activo', 'Interno', 'ines@conver.com', 'México', 'Administration & Finance', 'Finance', 'FINANCE COORDINATOR'),
  ('JOHNMAIRA', 'FIGUEREDO', 'Activo', 'Interno', 'johnmaira@conver.com', 'España', 'Marketing', 'Performance', 'SEM SPECIALIST JR.'),
  ('OSMARY', 'FIGUEROA', 'Activo', 'Interno', 'daniela@conver.com', 'España', 'Administration & Finance', 'Finance', 'FINANCE ANALYST'),
  ('MANUELA', 'FLOREZ', 'Activo', 'Interno', 'manuela@conver.com', 'España', 'Marketing', 'Design', 'WEB DESIGNER'),
  ('MARIA', 'GAMINARA', 'Activo', 'Interno', 'pilar@conver.com', 'Uruguay', 'Legal & Audit', 'Dirección', 'CLO'),
  ('KEVIN', 'GARCIA', 'Activo', 'Interno', 'kevin@conver.com', 'México', 'Operations - México', 'Administration', 'IMPROVEMENT'),
  ('CRISTIAN', 'GARCIA', 'Activo', 'Interno', 'cristian@conver.com', 'Colombia', 'Operations - Colombia', 'Customer Service', 'KAMS Manager - Colombia'),
  ('ERIK', 'GIL', 'Activo', 'Interno', 'erik@conver.com', 'México', 'IT', 'Development & Innovation', 'TECHNOLOGY SUPPORT SR'),
  ('ESTEFANI', 'GOMEZ', 'Activo', 'Interno', 'estefani@conver.com', 'México', 'AdTech', null, 'TRAINNING CONSULTING');

-- Insert more employees to keep the query size manageable
INSERT INTO public.organization_employees (first_name, last_name, status, employment_type, email, work_location, department, team, position)
VALUES
  ('NORMA', 'GOMEZ', 'Activo', 'Interno', 'norma@conver.com', 'México', 'Administration & Finance', 'Finance', 'FINANCE ANALYST'),
  ('DAVID', 'GONZALEZ', 'Activo', 'Interno', 'david@conver.com', 'España', 'Sales', null, 'INSIDE SALES'),
  ('TANIA', 'GONZALEZ', 'Activo', 'Interno', 'recepcion@conver.com', 'México', 'Office Services', 'Administration', 'OFFICE ASSISTANT'),
  ('ADRIANA', 'GUTIERREZ', 'Activo', 'Interno', 'adriana@conver.com', 'México', 'AdTech', null, 'EXECUTIVE ACCOUNT CONSULTANT'),
  ('SEBASTIAN', 'HERNANDEZ', 'Activo', 'Interno', 'sebastian@conver.com', 'Colombia', 'Human Resources', 'Recruitment', 'RECRUITMENT COORDINATOR'),
  ('MARIANA', 'HERRERA', 'Activo', 'Interno', 'mariana@conver.com', 'México', 'Marketing', 'Performance', 'DIGITAL MEDIA SPECIALIST'),
  ('VICTOR', 'IBARRA', 'Activo', 'Interno', 'victor@conver.com', 'México', 'BI', null, 'BI SPECIALIST'),
  ('CAROLINA', 'JARAMILLO', 'Activo', 'Interno', 'carolina@conver.com', 'Colombia', 'Marketing', 'Performance', 'SEM SPECIALIST'),
  ('HECTOR', 'JIMENEZ', 'Activo', 'Interno', 'hector@conver.com', 'México', 'Marketing', 'Design', 'FRONTEND DEVELOPER'),
  ('SARA', 'LARA', 'Activo', 'Interno', 'seleccion@conver.com', 'Colombia', 'Human Resources', 'Human Resources', 'RECRUITMENT TRAINEE'),
  ('MAGDALENA', 'LAZCANO', 'Activo', 'Interno', 'magdalena@conver.com', 'México', 'Operations - México', 'Contact Center', 'CONTACT CENTER SALES MANAGER'),
  ('ANTONIO', 'LLAMAS', 'Activo', 'Interno', 'antonio@conver.com', 'España', 'Technology', null, 'SOFTWARE ENGINEER'),
  ('KAREN', 'LOPEZ', 'Activo', 'Interno', 'karen@conver.com', 'México', 'Talent & Culture', null, 'TALENT & CULTURE COORDINATOR'),
  ('JHON', 'LOZANO', 'Activo', 'Interno', 'jhon@conver.com', 'Colombia', 'IT', 'Support', 'SUPPORT ENGINEER'),
  ('SAMUEL', 'LOZOYA', 'Activo', 'Interno', 'samuel@conver.com', 'España', 'Technology', null, 'DESARROLLADOR FULL STACK'),
  ('NATALIA', 'LUGO', 'Activo', 'Interno', 'natalia@conver.com', 'Colombia', 'Talent & Culture', null, 'TALENT & CULTURE TRAINEE'),
  ('RICARDO', 'MACIAS', 'Activo', 'Interno', 'ricardo@conver.com', 'México', 'Operations - México', null, 'EXECUTIVE ACCOUNT CONSULTANT'),
  ('SERGIO', 'MACIAS', 'Activo', 'Interno', 'sergio@conver.com', 'Colombia', 'Marketing', null, 'TRAFFICKER DIGITAL'),
  ('JUAN', 'MANJARREZ', 'Activo', 'Interno', 'juan@conver.com', 'México', 'IT', 'Support', 'IT  MANAGER'),
  ('DIEGO', 'MAQUI', 'Activo', 'Interno', 'diego@conver.com', 'España', 'Administration & Finance', 'Dirección', 'CFO');

-- Insert final batch of employees
INSERT INTO public.organization_employees (first_name, last_name, status, employment_type, email, work_location, department, team, position)
VALUES
  ('LAURA', 'MARTINEZ', 'Activo', 'Interno', 'laura@conver.com', 'Colombia', 'Human Resources', 'Human Resources', 'RECRUITMENT SPECIALIST'),
  ('ENRIQUE', 'MARTINEZ', 'Activo', 'Interno', 'enrique@conver.com', 'España', 'AdTech', null, 'PRESALES ENGINEER'),
  ('LAURA', 'MARTINEZ', 'Activo', 'Interno', 'nicol@conver.com', 'Colombia', 'IT', null, 'DESARROLLADOR FULL STACK'),
  ('KATERIN', 'MENDOZA', 'Activo', 'Interno', 'katerin@conver.com', 'España', 'Administration & Finance', 'Finance', 'FINANCE COORDINATOR'),
  ('DANIEL', 'MIGUELAÑEZ', 'Activo', 'Interno', 'daniel@conver.com', 'España', 'Technology', 'Development & Innovation', 'DEVELOPER JR.'),
  ('JUAN', 'MONDRAGON', 'Activo', 'Interno', 'juan@conver.com', 'Colombia', 'IT', null, 'DESARROLLADOR FULL STACK'),
  ('JESSICA', 'MORA', 'Activo', 'Interno', 'jessica@conver.com', 'México', 'Legal & Audit', null, 'LEGAL SPECIALIST'),
  ('CAROLINA', 'OLIVERA', 'Activo', 'Interno', 'carolina@conver.com', 'Uruguay', 'Administration & Finance', null, 'HEAD OF FINANCE'),
  ('JENNIFER', 'ORREGO', 'Activo', 'Interno', 'jennifer@conver.com', 'Perú', 'Administration & Finance', 'Accounting', 'ACCOUNTING ANALYST'),
  ('MAGALI', 'ORTEGA', 'Activo', 'Interno', 'mortega@inconcert@conver.com', 'España', 'Administration & Finance', 'Accounting', 'ACCOUNTING COORDINATOR'),
  ('MARIA', 'OSTOS', 'Activo', 'Interno', 'maria@conver.com', 'Colombia', 'BI', null, 'BI SPECIALSIT JR'),
  ('ROMARIO', 'PARIMANGO', 'Activo', 'Interno', 'romario@conver.com', 'Perú', 'Operations - Perú', null, 'KAM MANAGER'),
  ('ORLAN', 'PARRA', 'Activo', 'Interno', 'orlan@conver.com', 'España', 'Marketing', null, 'TRAFFIKER DIGITAL JR.'),
  ('JOSE', 'PASCUAL', 'Activo', 'Interno', 'joseluis@conver.com', 'España', 'Dirección', 'Dirección', 'COO'),
  ('ERICK', 'PATIÑO', 'Activo', 'Interno', 'erick@conver.com', 'México', 'Sales', null, 'INSIDE SALES'),
  ('RICARDO', 'PERDOMO', 'Activo', 'Interno', 'ricardo@conver.com', 'Colombia', 'IT', 'Development & Innovation', 'DEVELOPER'),
  ('AARON', 'PEREZ', 'Activo', 'Interno', 'aaron@conver.com', 'México', 'AdTech', null, 'KAM'),
  ('JOSE', 'PEREZ', 'Activo', 'Interno', 'josealfredo@conver.com', 'México', 'Marketing', 'Design', 'WEB DESIGNER MANAGER'),
  ('MIGUEL', 'PEÑA', 'Activo', 'Interno', 'miguel@conver.com', 'México', 'IT', 'Development & Innovation', 'FULL STACK ENGINEER'),
  ('BERNARDO', 'PEÑUELA', 'Activo', 'Interno', 'bernardo@conver.com', 'Colombia', 'Human Resources', null, 'HR Specialist');
  
-- Insert final batch of remaining employees  
INSERT INTO public.organization_employees (first_name, last_name, status, employment_type, email, work_location, department, team, position)
VALUES
  ('ALFREDO', 'PINEDA', 'Activo', 'Interno', 'alfredo@conver.com', 'México', 'IT', 'Development & Innovation', 'DEVOPS ENGINEER'),
  ('SERGIO', 'PORRAGAS', 'Activo', 'Interno', 'sergio@conver.com', 'México', null, null, 'CEO'),
  ('MARISOL', 'PÁRRAGA', 'Activo', 'Interno', 'marisol@conver.com', 'México', 'Marketing', 'Design', 'WEB DESIGNER'),
  ('LETICIA', 'RAMOS', 'Activo', 'Interno', 'leticia@conver.com', 'México', 'Administration & Finance', 'Accounting', 'ACCOUNTING ANALYST'),
  ('WENDY', 'RANGEL', 'Activo', 'Interno', 'wendy@conver.com', 'México', 'Sales', null, 'ENTERPRISES SALES EXECUTIVE'),
  ('LEIDY', 'RESTREPO', 'Activo', 'Interno', 'leidy@conver.com', 'Colombia', 'Human Resources', 'Human Resources', 'HUMAN RESOURCES ASSISTANT'),
  ('PAULA', 'RIAL', 'Activo', 'Interno', 'paula@conver.com', 'España', 'Operations -  España', 'Customer Service', 'PROJECT MANAGER'),
  ('CARLOS', 'ROCHA', 'Activo', 'Interno', 'carlos@conver.com', 'Colombia', 'Talent & Culture', null, 'TALENT & CULTURE TRAINEE'),
  ('JOSE', 'ROMO', 'Activo', 'Interno', 'jose@conver.com', 'México', 'AdTech', null, 'EXECUTIVE ACCOUNT CONSULTANT'),
  ('JAVIER', 'ROYO', 'Activo', 'Interno', 'javier@conver.com', 'España', 'Marketing', 'Performance', 'SEM SPECIALIST'),
  ('JORGE', 'SALAMANCA', 'Activo', 'Interno', 'esteban@conver.com', 'Colombia', 'Marketing', 'Performance', 'SEM SPECIALIST'),
  ('CARLOS', 'SANABRIA', 'Activo', 'Interno', 'carlos@conver.com', 'Colombia', 'IT', 'Support', 'SUPPORT ENGINEER'),
  ('NOE', 'SANTIAGO', 'Activo', 'Interno', 'noe@conver.com', 'México', 'Administration & Finance', 'Finance', 'FINANCE ANALYST'),
  ('ANGEL', 'SILVA', 'Activo', 'Interno', 'angel@conver.com', 'México', 'IT', 'Support', 'SUPPORT ANALYST'),
  ('MAYRA', 'SILVA', 'Activo', 'Interno', 'mayra@conver.com', 'México', 'Talent & Culture', null, 'TALENT & CULTURE DIRECTOR'),
  ('MACARENA', 'SOFIA', 'Activo', 'Interno', 'macarena@conver.com', 'España', 'Marketing', 'Design', 'FRONTED DEVELOPER'),
  ('JULIO', 'TORRES', 'Activo', 'Interno', 'julio@conver.com', 'México', 'AdTech', 'Customer Service', 'KAM'),
  ('ANDRIK', 'VARELA', 'Activo', 'Interno', 'andrik@conver.com', 'México', 'Administration & Finance', 'Finance', 'FINANCE ANALYST'),
  ('STEVEN', 'VASQUEZ', 'Activo', 'Interno', 'steven@conver.com', 'España', 'IT', null, 'IT DIRECTOR'),
  ('EDWIN', 'VERA', 'Activo', 'Interno', 'edwin@conver.com', 'Colombia', 'IT', 'Support', 'SUPPORT ENGINEER JR'),
  ('JOEL', 'VERGARA', 'Activo', 'Interno', 'joel@conver.com', 'México', 'BI', null, 'BI ANALYST JR'),
  ('STEPHANY', 'VERTIZ', 'Activo', 'Interno', 'stephany@conver.com', 'Perú', 'Administration & Finance', 'Accounting', 'ACCOUNTING COORDINATOR'),
  ('GLORIA', 'VILLARREAL', 'Activo', 'Interno', 'gloria@conver.com', 'Colombia', 'Sales', null, 'COMERCIAL HUNTER'),
  ('FRANCISCO', 'VILLAVERDE', 'Activo', 'Interno', 'francisco@conver.com', 'México', 'IT', 'Development & Innovation', 'IT & SOLUTIONS ARCHITECT GLOBAL DIRECTOR');
