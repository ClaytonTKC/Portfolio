DELETE FROM skills;
DELETE FROM projects;
DELETE FROM experiences;
DELETE FROM education;
DELETE FROM hobbies;

-- Insert Skills
-- Languages
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
('Java', 'Languages', 90, 1),
('JavaScript', 'Languages', 90, 2),
('C#', 'Languages', 80, 3),
('C++ (Arduino)', 'Languages', 75, 4),
('Kotlin', 'Languages', 70, 5),
('SQL (Postgres, MySQL)', 'Languages', 85, 6),
('Python', 'Languages', 85, 7);

-- Frameworks
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
('Spring Boot', 'Frameworks', 85, 1),
('React', 'Frameworks', 85, 2),
('Node.js', 'Frameworks', 80, 3),
('JUnit', 'Frameworks', 75, 4),
('Laravel', 'Frameworks', 70, 5),
('Git', 'Frameworks', 90, 6);

-- Developer Tools
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
('GitHub', 'Developer Tools', 90, 1),
('Playwright', 'Developer Tools', 80, 2),
('Docker', 'Developer Tools', 75, 3),
('JIRA (Scrum methods)', 'Developer Tools', 85, 4);

-- Libraries
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
('Mockito', 'Libraries', 75, 1),
('Bootstrap', 'Libraries', 80, 2),
('Lombok', 'Libraries', 80, 3);

-- Insert Projects
INSERT INTO projects (title, description, tags, sort_order) VALUES
('Visual Impact', 'Built a B2B platform connecting advertisers with media owners to manage and display ads on digital screens.\nRole: Developed and refined the UI for booking and advertisement pages, improving navigation and performance for both advertisers and media owners.', '{"Spring Boot", "JavaScript", "CSS", "React", "JIRA", "Playwright"}', 1),
('Champlain Pet Clinic', 'Developed a microservice-based web application that allows users to create visits, purchase products, and submit reviews.\nRole: Designed and enhanced the Visit and Review pages to improve the user interface and overall experience.', '{"Spring Boot", "JavaScript", "HTML", "CSS", "React", "JIRA"}', 2),
('Library Management', 'Collaborated on developing a microservice-based library system to manage user accounts, book inventory, and loan tracking.\nRole: Led the implementation of the author microservice.', '{"Springboot", "Docker", "Java"}', 3);

-- Insert Experience
INSERT INTO experiences (title, company, location, start_date, end_date, is_current, description, sort_order) VALUES
('Computer Science Tutor', 'Champlain College', 'Saint-Lambert, QC', '2025-08-01', '2025-11-01', false, '{"Mentored students in computer science concepts.", "Learned how to collaborate with others in a fast-paced and high-pressure environment."}', 1),
('Food Service Worker', 'McDonald', 'Brossard, QC', '2021-08-01', '2023-08-01', false, '{"Mentored employees in the kitchen.", "Learned how to collaborate with others in a fast-paced and high-pressure environment."}', 2),
('Mathematics Tutor', 'Kumon', 'Longueuil, QC', '2022-08-01', '2023-06-01', false, '{"Guided learners through exercises and encouraged strong study habits.", "Supported student progress and motivated them to build confidence in math."}', 3);

-- Insert Education
INSERT INTO education (degree, school, location, start_date, end_date, description, sort_order) VALUES
('Diploma of College Studies (DEC) in Computer Science', 'Champlain College Saint-Lambert', 'Saint-Lambert, QC', '2023-08-01', '2026-06-01', 'Expected graduation June 2026', 1),
('Secondary School Diploma', 'Centennial Regional High School', 'Greenfield Park, QC', '2018-09-01', '2023-06-01', '', 2);
