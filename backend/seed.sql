-- Nischal Rai Portfolio - Seed Data
-- Run this AFTER schema.sql has been applied successfully.
-- Contains initial data for all tables.

-- =============================================================================
-- profile
-- =============================================================================
insert into public.profiles (id, name, role, taglines, headline, intro, about, resume_url, location, email, interests)
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Nischal Rai',
  'Developer',
  array['Passionate Developer', 'Curious Learner', 'Problem Solver'],
  'I build responsive, user-focused websites.',
  'I am a passionate developer who enjoys turning ideas into responsive and meaningful digital experiences. I love learning new technologies and building projects that solve real problems.',
  'I am a hardworking and passionate developer who enjoys learning, experimenting and adapting to new technologies. I believe every project is an opportunity to learn something new.',
  '/resume.pdf',
  'Nepal',
  'nischalrai@example.com',
  array['Learning new programming concepts', 'Exploring new technologies', 'Building websites', 'Solving problems', 'Working on real projects', 'Understanding how systems work', 'Improving existing code', 'Adapting to unfamiliar codebases']
)
on conflict (id) do nothing;

-- =============================================================================
-- philosophy items
-- =============================================================================
insert into public.philosophy_items (profile_id, title, description, icon, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Always Learning', 'Technology changes constantly, so I enjoy learning new tools and approaches.', 'book-open', 0)
on conflict do nothing;

insert into public.philosophy_items (profile_id, title, description, icon, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Adaptability', 'I am comfortable entering an unfamiliar project and learning the existing structure and workflow.', 'shuffle', 1)
on conflict do nothing;

insert into public.philosophy_items (profile_id, title, description, icon, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Building Through Practice', 'Instead of only learning theory, I believe in learning by building real projects.', 'hammer', 2)
on conflict do nothing;

insert into public.philosophy_items (profile_id, title, description, icon, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Problem Solving', 'When something does not work, I enjoy understanding why and finding a practical solution.', 'wrench', 3)
on conflict do nothing;

-- =============================================================================
-- progression items
-- =============================================================================
insert into public.progression_items (profile_id, step, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Learn', 0)
on conflict do nothing;

insert into public.progression_items (profile_id, step, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Experiment', 1)
on conflict do nothing;

insert into public.progression_items (profile_id, step, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Build', 2)
on conflict do nothing;

insert into public.progression_items (profile_id, step, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Improve', 3)
on conflict do nothing;

insert into public.progression_items (profile_id, step, order_index)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'Adapt', 4)
on conflict do nothing;

-- =============================================================================
-- skills
-- =============================================================================
insert into public.skills (name, category, order_index) values ('JavaScript', 'language', 0) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Python', 'language', 1) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Java', 'language', 2) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('React', 'frontend', 0) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Tailwind CSS', 'frontend', 1) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('HTML / CSS', 'frontend', 2) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('TypeScript', 'frontend', 3) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Node.js', 'backend', 0) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Express', 'backend', 1) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('MongoDB', 'database', 0) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('MySQL', 'database', 1) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Supabase', 'database', 2) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Git / GitHub', 'tools', 0) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Linux / CLI', 'tools', 1) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('Figma', 'tools', 2) on conflict do nothing;
insert into public.skills (name, category, order_index) values ('VS Code', 'tools', 3) on conflict do nothing;

-- =============================================================================
-- soft skills
-- =============================================================================
insert into public.soft_skills (name, description, order_index)
values ('Team collaboration', 'Comfortable working within a team, sharing progress and reviewing code.', 0)
on conflict do nothing;

insert into public.soft_skills (name, description, order_index)
values ('Time management', 'Plan work in small chunks and keep momentum without losing focus.', 1)
on conflict do nothing;

insert into public.soft_skills (name, description, order_index)
values ('Problem solving', 'Break down problems, research what I do not know and ship a fix.', 2)
on conflict do nothing;

insert into public.soft_skills (name, description, order_index)
values ('Adaptability', 'Pick up unfamiliar tools and codebases quickly, and adapt to new requirements.', 3)
on conflict do nothing;

-- =============================================================================
-- projects
-- =============================================================================
insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
values (
  'p-1', 'E-Commerce Storefront',
  'A full-stack e-commerce solution with product browsing, cart, checkout flow and an admin dashboard. Built with the MERN stack.',
  'Full-stack MERN e-commerce platform with cart, checkout and an admin dashboard.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  'https://github.com/nischalrai', '',
  array['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
  'Full-Stack', true, 0
) on conflict (id) do nothing;

insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
values (
  'p-2', 'Task Manager App',
  'A collaborative task manager with boards, drag-and-drop reordering, workspaces and real-time status updates.',
  'Collaborative task manager with Kanban boards, drag-and-drop and workspaces.',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
  'https://github.com/nischalrai', '',
  array['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
  'Web App', true, 1
) on conflict (id) do nothing;

insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
values (
  'p-3', 'Weather Dashboard',
  'A weather dashboard with location search, animated forecasts and historical data. Great practice with external APIs.',
  'Weather dashboard with location search, animated forecasts and historical data.',
  'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
  'https://github.com/nischalrai', '',
  array['React', 'OpenWeather API', 'Tailwind CSS'],
  'Frontend', false, 2
) on conflict (id) do nothing;

insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
values (
  'p-4', 'Developer Blog',
  'A content-focused blog platform with MDX support, syntax highlighting, RSS feed and basic SEO.',
  'Developer blog platform with MDX, syntax highlighting and RSS.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  'https://github.com/nischalrai', '',
  array['Next.js', 'MDX', 'TypeScript', 'Tailwind CSS'],
  'Web App', true, 3
) on conflict (id) do nothing;

insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
values (
  'p-5', 'Real-Time Chat',
  'A messaging app with rooms, direct messages, file sharing and message reactions.',
  'Real-time chat with rooms, DMs, file sharing and emoji reactions.',
  'https://images.unsplash.com/photo-1577563908411-5077b6dc7600?w=800',
  'https://github.com/nischalrai', '',
  array['React', 'Express', 'Socket.io', 'Tailwind CSS'],
  'Full-Stack', false, 4
) on conflict (id) do nothing;

insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
values (
  'p-6', 'Portfolio Website',
  'This portfolio. A component-based, responsive site with TypeScript, Tailwind CSS and a backend-ready contact form.',
  'Component-based, responsive portfolio with backend-ready contact form.',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
  'https://github.com/nischalrai', '',
  array['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  'Template', false, 5
) on conflict (id) do nothing;

-- =============================================================================
-- experiences
-- =============================================================================
insert into public.experiences (id, type, role, company, company_url, period, location, description, highlights, technologies, order_index)
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'internship',
  'Frontend Developer Intern',
  'Youth IT',
  'https://hamroyouthit.com/',
  'Jul 2025 - Sep 2025',
  'Itahari, Nepal',
  'Completed a frontend development internship at Youth IT, working on real client-facing interfaces and learning professional development workflows.',
  array[
    'Built and maintained responsive frontend components',
    'Collaborated with the team using Git and code reviews',
    'Translated designs into polished, accessible interfaces',
    'Improved UI performance and cross-browser compatibility',
    'Adapted to an existing codebase and team workflow'
  ],
  array['React', 'TypeScript', 'Tailwind CSS', 'Git / GitHub'],
  0
) on conflict (id) do nothing;

insert into public.experiences (id, type, role, company, company_url, period, location, description, highlights, technologies, order_index)
values (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'freelance',
  'Freelance Developer',
  'Project-Based',
  null,
  '2023 - Present',
  'Remote',
  'Worked on freelance and project-based web development, building responsive websites and adapting solutions to different requirements.',
  array[
    'Built responsive interfaces for a variety of small projects',
    'Worked with frontend technologies to create modern interfaces',
    'Understood client requirements and translated them into functional solutions',
    'Made UI and responsive improvements on existing projects',
    'Worked within existing codebases and adapted to different requirements',
    'Debugged and fixed issues across browsers and devices'
  ],
  array['React', 'JavaScript', 'HTML / CSS', 'Tailwind CSS', 'Git'],
  1
) on conflict (id) do nothing;

-- =============================================================================
-- education
-- =============================================================================
insert into public.education (id, institution, degree, period, location, faculty, status, highlights, subjects, icon, order_index)
values (
  '00000000-0000-0000-0000-000000000003'::uuid,
  'Itahari International College',
  'BIT (Hons) - BSc IT (Hons)',
  '2024 - Present',
  'Itahari, Nepal',
  null,
  'Pursuing',
  array[
    'Bachelor of Information Technology (Hons)',
    'Currently pursuing - ongoing',
    'Strengthening fundamentals in software engineering and programming'
  ],
  array['Software Engineering', 'Database Systems', 'Object-Oriented Programming', 'Data Structures and Algorithms', 'Web Technologies'],
  'GraduationCap',
  0
) on conflict (id) do nothing;

insert into public.education (id, institution, degree, period, location, faculty, status, highlights, subjects, icon, order_index)
values (
  '00000000-0000-0000-0000-000000000004'::uuid,
  'Goldengate International College',
  'High School - Computer Science',
  '2021 - 2023',
  'Kathmandu, Nepal',
  'Management',
  'Completed 2023',
  array[
    'Completed high school with a focus on Computer Science',
    'Built a foundational understanding of programming and logic',
    'Faculty: Management'
  ],
  null,
  'School',
  1
) on conflict (id) do nothing;

-- =============================================================================
-- services
-- =============================================================================
insert into public.services (title, description, icon, order_index)
values ('Responsive Websites', 'Websites that work seamlessly across mobile, tablet and desktop.', 'layout', 0)
on conflict do nothing;

insert into public.services (title, description, icon, order_index)
values ('Business Websites', 'Professional websites for businesses, organizations and personal brands.', 'briefcase', 1)
on conflict do nothing;

insert into public.services (title, description, icon, order_index)
values ('Portfolio Websites', 'Personal portfolios for developers, students, designers and professionals.', 'user', 2)
on conflict do nothing;

insert into public.services (title, description, icon, order_index)
values ('Frontend Development', 'Modern interfaces using React, TypeScript and Tailwind CSS.', 'code', 3)
on conflict do nothing;

insert into public.services (title, description, icon, order_index)
values ('Full-Stack Projects', 'Projects involving frontend, backend and database integration.', 'database', 4)
on conflict do nothing;

insert into public.services (title, description, icon, order_index)
values ('Website Improvements', 'Responsive improvements, UI upgrades, animations and redesigns.', 'refresh-cw', 5)
on conflict do nothing;

-- =============================================================================
-- social links
-- =============================================================================
insert into public.social_links (label, href, icon, order_index)
values ('GitHub', 'https://github.com/nischalrai', 'github', 0)
on conflict do nothing;

insert into public.social_links (label, href, icon, order_index)
values ('LinkedIn', 'https://linkedin.com/in/nischalrai', 'linkedin', 1)
on conflict do nothing;

insert into public.social_links (label, href, icon, order_index)
values ('X', 'https://x.com/nischalrai', 'x', 2)
on conflict do nothing;

insert into public.social_links (label, href, icon, order_index)
values ('Instagram', 'https://instagram.com/nischalrai', 'instagram', 3)
on conflict do nothing;

-- =============================================================================
-- gallery
-- =============================================================================
insert into public.gallery (id, title, description, image_url, category, tags, featured, order_index, shape, width, height, position_x, position_y, object_fit, object_position, is_visible)
values ('g-1', 'Workspace setup', 'Developer desk with dual monitors and warm lighting.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Setup', array['workspace', 'desk', 'monitors'], true, 0, 'portrait', 4, 4, 1, 1, 'cover', 'center', true)
on conflict (id) do nothing;

insert into public.gallery (id, title, description, image_url, category, tags, featured, order_index, shape, width, height, position_x, position_y, object_fit, object_position, is_visible)
values ('g-2', 'Late-night coding', 'Dark IDE theme at 2am - when the best ideas land.', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', 'Code', array['coding', 'night', 'ide'], false, 1, 'landscape', 4, 2, 5, 1, 'cover', 'center', true)
on conflict (id) do nothing;

insert into public.gallery (id, title, description, image_url, category, tags, featured, order_index, shape, width, height, position_x, position_y, object_fit, object_position, is_visible)
values ('g-3', 'Whiteboard session', 'Planning architecture before writing the first line.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'Planning', array['planning', 'architecture', 'whiteboard'], true, 2, 'medium_square', 4, 2, 9, 1, 'cover', 'center', true)
on conflict (id) do nothing;

-- =============================================================================
-- about gallery preview
-- =============================================================================
insert into public.about_gallery_preview (gallery_item_id, display_order)
values ('g-1', 0)
on conflict do nothing;

insert into public.about_gallery_preview (gallery_item_id, display_order)
values ('g-2', 1)
on conflict do nothing;

insert into public.about_gallery_preview (gallery_item_id, display_order)
values ('g-3', 2)
on conflict do nothing;

-- =============================================================================
-- faqs
-- =============================================================================
insert into public.faqs (question, answer, order_index)
values ('What can I deliver for you?', 'Modern, responsive websites including business sites, portfolios, frontend work and full-stack projects.', 0)
on conflict do nothing;

insert into public.faqs (question, answer, order_index)
values ('What technologies do you use?', 'My primary stack is React, TypeScript, Tailwind CSS, Node.js and Express. I also work with MongoDB, MySQL and Supabase.', 1)
on conflict do nothing;

insert into public.faqs (question, answer, order_index)
values ('How do you ensure cross-device compatibility?', 'I build mobile-first using responsive grids and Tailwind breakpoints, tested across phones, tablets, laptops and desktops.', 2)
on conflict do nothing;

insert into public.faqs (question, answer, order_index)
values ('Are you open to internships?', 'Yes. I am currently open to internship opportunities. Reach out through the contact page.', 3)
on conflict do nothing;

insert into public.faqs (question, answer, order_index)
values ('What was your experience at Youth IT?', 'I completed a frontend internship at Youth IT in Itahari, working on real client interfaces and collaborating with the team.', 4)
on conflict do nothing;

insert into public.faqs (question, answer, order_index)
values ('How can we contact you for a project?', 'Use the contact page to send a message. I usually reply within a couple of days.', 5)
on conflict do nothing;

-- =============================================================================
-- nav links
-- =============================================================================
insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('Home', '/', 'home', false, 0)
on conflict do nothing;

insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('About', '/about', 'user', false, 1)
on conflict do nothing;

insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('Skills', '/skills', 'code', false, 2)
on conflict do nothing;

insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('Projects', '/projects', 'folder', false, 3)
on conflict do nothing;

insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('Experience', '/experience', 'briefcase', false, 4)
on conflict do nothing;

insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('Gallery', '/gallery', 'image', false, 5)
on conflict do nothing;

insert into public.nav_links (label, "to", icon, is_contact, order_index)
values ('Let''s Talk', '/contact', 'mail', true, 6)
on conflict do nothing;
