-- Update script for French translations

-- Projects
UPDATE projects
SET 
  title_fr = 'Visual Impact',
  description_fr = 'Création d''une plateforme B2B reliant les annonceurs et les propriétaires de médias pour gérer et afficher des publicités sur des écrans numériques.\nRôle: travaillé sur la page de visite et amélioré l''interface de la page d''avis.\nTechnologies: Spring Boot, JavaScript, CSS, React, JIRA (méthodes Scrum)'
WHERE title = 'Visual Impact';

UPDATE projects
SET 
  title_fr = 'Champlain Pet Clinic',
  description_fr = 'Développement d''une application web basée sur une architecture de microservices permettant aux utilisateurs de créer des visites, d''acheter des produits et de soumettre des avis.\nRôle: travaillé sur la page de visite et amélioré l''interface de la page d''avis.\nTechnologies: Spring Boot, JavaScript, HTML, CSS, React, JIRA (méthodes Scrum)'
WHERE title = 'Champlain Pet Clinic';

UPDATE projects
SET 
  title_fr = 'LibraryManagement',
  description_fr = 'Conçu un microservice en groupe pour gérer les opérations d''une bibliothèque, incluant l''inventaire des livres, les comptes utilisateurs et le suivi des prêts\nRôle: responsable du microservice Auteur\nTechnologies: Spring Boot, Docker, Java'
WHERE title = 'Library Management';

-- Experience
UPDATE experiences
SET 
  title_fr = 'Tuteur en informatique',
  company_fr = 'Collège Champlain',
  location_fr = 'Saint-Lambert, QC',
  description_fr = '{"Encadrait les étudiants dans leurs travaux et leurs projets .", "Appris à collaborer efficacement dans un environnement dynamique et sous pression"}'
WHERE title = 'Computer Science Tutor';

UPDATE experiences
SET 
  title_fr = 'Employé en service alimentaire',
  company_fr = 'McDonald',
  location_fr = 'Brossard, QC',
  description_fr = '{"Supervisé les employés en cuisine.", "Organisé le personnel de cuisine pour assurer le bon fonctionnement."}'
WHERE title = 'Food Service Worker';

UPDATE experiences
SET 
  title_fr = 'Tuteur en mathématiques',
  company_fr = 'Kumon',
  location_fr = 'Longueuil, QC',
  description_fr = '{"Aidait les élèves à comprendre et pratiquer les notions de mathématiques", "Accompagnait les étudiants dans la résolution d''exercices et le développement de bonnes méthodes de travail"}'
WHERE title = 'Mathematics Tutor';

-- Education
UPDATE education
SET 
  degree_fr = 'Diplôme d''études collégiales (DEC) en informatique',
  school_fr = 'Collège Champlain Saint-Lambert',
  location_fr = 'Saint-Lambert, QC',
  description_fr = 'août 2023 – juin 2026, prévu'
WHERE degree = 'Diploma of College Studies (DEC) in Computer Science';

UPDATE education
SET 
  degree_fr = 'Diplôme d''études secondaires',
  school_fr = 'Centennial Regional High School',
  location_fr = 'Greenfield Park, QC',
  description_fr = 'sept. 2018 – juin 2023'
WHERE degree = 'Secondary School Diploma';
