BEGIN;

TRUNCATE TABLE
  skills,
  projects,
  experiences,
  education,
  hobbies,
  testimonials,
  messages
RESTART IDENTITY CASCADE;

-- Insert Skills
-- Languages
INSERT INTO skills (name, category, proficiency, sort_order, show_in_portfolio) VALUES
('Java', 'Languages', 90, 1, true),
('JavaScript', 'Languages', 90, 2, true),
('C#', 'Languages', 80, 3, true),
('C++ (Arduino)', 'Languages', 75, 4, true),
('Kotlin', 'Languages', 70, 5, true),
('SQL (Postgres, MySQL)', 'Languages', 85, 6, true),
('Python', 'Languages', 85, 7, true);

-- Frameworks
INSERT INTO skills (name, category, proficiency, sort_order, show_in_portfolio) VALUES
('Spring Boot', 'Frameworks', 85, 1, true),
('React', 'Frameworks', 85, 2, true),
('Node.js', 'Frameworks', 80, 3, true),
('JUnit', 'Frameworks', 75, 4, true),
('Laravel', 'Frameworks', 70, 5, true),
('Git', 'Frameworks', 90, 6, true);

-- Developer Tools
INSERT INTO skills (name, category, proficiency, sort_order, show_in_portfolio) VALUES
('GitHub', 'Developer Tools', 90, 1, true),
('Playwright', 'Developer Tools', 80, 2, true),
('Docker', 'Developer Tools', 75, 3, true),
('JIRA (Scrum methods)', 'Developer Tools', 85, 4, true);

-- Libraries
INSERT INTO skills (name, category, proficiency, sort_order, show_in_portfolio) VALUES
('Mockito', 'Libraries', 75, 1, true),
('Bootstrap', 'Libraries', 80, 2, true),
('Lombok', 'Libraries', 80, 3, true);

-- Insert Projects
INSERT INTO projects (title, title_fr, description, description_fr, tags, featured, sort_order) VALUES
('Visual Impact', 'Visual Impact', 'Built a B2B platform connecting advertisers with media owners to manage and display ads on digital screens.\nRole: Developed and refined the UI for booking and advertisement pages, improving navigation and performance for both advertisers and media owners.', 'Création d''une plateforme B2B reliant les annonceurs et les propriétaires de médias pour gérer et afficher des publicités sur des écrans numériques.', '{"Spring Boot", "JavaScript", "CSS", "React", "JIRA", "Playwright"}', true, 1),
('Champlain Pet Clinic', 'Clinique vétérinaire Champlain', 'Developed a microservice-based web application that allows users to create visits, purchase products, and submit reviews.\nRole: Designed and enhanced the Visit and Review pages to improve the user interface and overall experience.', 'Développement d''une application web en microservices permettant de créer des visites, acheter des produits et soumettre des avis.', '{"Spring Boot", "JavaScript", "HTML", "CSS", "React", "JIRA"}', true, 2),
('Library Management', 'Gestion de bibliothèque', 'Collaborated on developing a microservice-based library system to manage user accounts, book inventory, and loan tracking.\nRole: Led the implementation of the author microservice.', 'Conception d''un système de bibliothèque en microservices pour gérer les comptes, l''inventaire et les prêts.', '{"Spring Boot", "Docker", "Java"}', false, 3);

-- Insert Experience
INSERT INTO experiences (
  title, title_fr, company, company_fr, location, location_fr, start_date, end_date, is_current, description, description_fr, sort_order
) VALUES
('Computer Science Tutor', 'Tuteur en informatique', 'Champlain College', 'Collège Champlain', 'Saint-Lambert, QC', 'Saint-Lambert, QC', '2025-08-01', '2025-11-01', false, '{"Mentored students in computer science concepts.", "Collaborated in a fast-paced and high-pressure environment."}', '{"Encadrement des étudiants en informatique.", "Collaboration efficace dans un environnement dynamique."}', 1),
('Food Service Worker', 'Employé en service alimentaire', 'McDonald', 'McDonald', 'Brossard, QC', 'Brossard, QC', '2021-08-01', '2023-08-01', false, '{"Mentored employees in the kitchen.", "Organized workflow to maintain speed and quality."}', '{"Supervision des employés en cuisine.", "Organisation des opérations pour assurer le bon fonctionnement."}', 2),
('Mathematics Tutor', 'Tuteur en mathématiques', 'Kumon', 'Kumon', 'Longueuil, QC', 'Longueuil, QC', '2022-08-01', '2023-06-01', false, '{"Guided learners through exercises and encouraged strong study habits.", "Supported student progress and confidence in math."}', '{"Aide aux élèves dans la compréhension des notions de mathématiques.", "Accompagnement dans la résolution d''exercices."}', 3);

-- Insert Education
INSERT INTO education (
  degree, degree_fr, school, school_fr, location, location_fr, start_date, end_date, description, description_fr, sort_order
) VALUES
('Diploma of College Studies (DEC) in Computer Science', 'Diplôme d''études collégiales (DEC) en informatique', 'Champlain College Saint-Lambert', 'Collège Champlain Saint-Lambert', 'Saint-Lambert, QC', 'Saint-Lambert, QC', '2023-08-01', '2026-06-01', 'Expected graduation June 2026', 'Prévision de diplomation en juin 2026', 1),
('Secondary School Diploma', 'Diplôme d''études secondaires', 'Centennial Regional High School', 'École secondaire Centennial Regional', 'Greenfield Park, QC', 'Greenfield Park, QC', '2018-09-01', '2023-06-01', '', '', 2);

-- Insert Hobbies
INSERT INTO hobbies (name, icon, description, sort_order) VALUES
('Gym', 'dumbbell', 'Strength training and fitness routines.', 1),
('Chess', 'chess', 'Strategy and tactical thinking practice.', 2),
('Coding Side Projects', 'laptop', 'Building and experimenting with new ideas.', 3);

-- Insert approved Testimonials
INSERT INTO testimonials (author_name, author_role, author_email, content, rating, status) VALUES
('Sarah Jenkins', 'Product Manager', 'sarah.j@techstart.com', 'Working with this developer was an absolute pleasure. High-quality delivery and clear communication.', 5, 'approved'),
('Michael Chen', 'CTO', 'michael@innovate.io', 'Exceptional technical skills and maintainable code quality.', 5, 'approved');

-- Ensure contact info has one usable row
INSERT INTO contact_info (email, phone, location, linkedin, github, website)
VALUES (
  'JJR@portfolio.com',
  '',
  'Montreal, QC',
  'https://www.linkedin.com/',
  'https://github.com/',
  'https://claytkc.dev'
)
ON CONFLICT DO NOTHING;

COMMIT;
