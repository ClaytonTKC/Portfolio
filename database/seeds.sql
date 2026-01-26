-- Seeds for initial data

-- Skills
INSERT INTO skills (name, icon, proficiency, category, sort_order) VALUES
('React', '⚛️', 95, 'Frontend', 10),
('TypeScript', '📘', 90, 'Languages', 20),
('Go', '🐹', 85, 'Backend', 30),
('PostgreSQL', '🐘', 80, 'Database', 40),
('Docker', '🐳', 75, 'DevOps', 50),
('Tailwind CSS', '🎨', 90, 'Frontend', 60);

-- Projects
INSERT INTO projects (title, description, image_url, live_url, code_url, tags, featured, sort_order) VALUES
('E-Commerce Platform', 'A full-featured online store built with React and Go.', 'https://images.unsplash.com/photo-1557821552-17105176677c', 'https://example.com', 'https://github.com', ARRAY['React', 'Go', 'PostgreSQL'], true, 10),
('Task Management App', 'Drag and drop task board for teams.', 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91', 'https://example.com', 'https://github.com', ARRAY['TypeScript', 'React', 'Redux'], true, 20),
('Portfolio Website', 'Modern personal portfolio with admin dashboard.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 'https://example.com', 'https://github.com', ARRAY['React', 'Vite', 'Tailwind'], false, 30);

-- Experience
INSERT INTO experiences (title, company, location, start_date, end_date, is_current, description, sort_order) VALUES
('Senior Software Engineer', 'Tech Corp', 'San Francisco, CA', '2023-01-01', NULL, true, ARRAY['Led frontend team', 'Architected new API'], 10),
('Full Stack Developer', 'StartUp Inc', 'New York, NY', '2021-06-01', '2022-12-31', false, ARRAY['Built MVP', 'Implemented CI/CD'], 20);

-- Education
INSERT INTO education (degree, school, location, start_date, end_date, description, sort_order) VALUES
('Bachelor of Science in Computer Science', 'University of Technology', 'Boston, MA', '2017-09-01', '2021-05-01', 'Graduated with Honors', 10);

-- Hobbies
INSERT INTO hobbies (name, icon, description, sort_order) VALUES
('Photography', '📷', 'Landscape and street photography', 10),
('Gaming', '🎮', 'Strategy and RPG games', 20),
('Hiking', '🥾', 'Exploring national parks', 30);

-- Testimonials
INSERT INTO testimonials (author_name, author_role, author_email, content, rating, status) VALUES
('Jane Doe', 'Product Manager', 'jane@example.com', 'One of the best developers I have worked with.', 5, 'approved'),
('John Smith', 'CEO', 'john@example.com', 'Delivered the project on time and under budget.', 5, 'approved'),
('Anonymous', 'Visitor', 'anon@example.com', 'Nice website!', 4, 'pending');
