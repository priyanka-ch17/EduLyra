-- Demo seed data for Supabase. Run after schema.sql.
insert into public.skills (name,category) values
('JavaScript','Technical'),('TypeScript','Technical'),('React','Technical'),('Node.js','Technical'),
('Python','Technical'),('Java','Technical'),('C++','Technical'),('SQL','Technical'),('PostgreSQL','Technical'),
('Git','Technical'),('HTML','Technical'),('CSS','Technical'),('Tailwind CSS','Technical'),('REST APIs','Technical'),
('DSA','Technical'),('DBMS','Technical'),('Operating Systems','Technical'),('Networking','Technical'),
('AWS','Technical'),('Docker','Technical'),('Kubernetes','Technical'),('System Design','Technical'),
('Testing','Technical'),('Figma','Technical'),('Excel','Technical'),('Power BI','Technical'),
('Machine Learning','Technical'),('TensorFlow','Technical'),('Communication','Soft Skill'),
('Leadership','Soft Skill'),('Problem Solving','Soft Skill')
on conflict (name) do nothing;

insert into public.career_roles (title,description,required_skills) values
('Software Developer','Build reliable software products.','{JavaScript,SQL,Git,DSA}'),
('Frontend Developer','Build responsive product interfaces.','{HTML,CSS,JavaScript,React}'),
('Full Stack Developer','Own features across frontend and backend.','{React,Node.js,SQL,Git}'),
('Data Analyst','Turn data into business insight.','{SQL,Python,Power BI}'),
('Cloud Engineer','Build and operate cloud infrastructure.','{AWS,Linux,Networking,Docker}'),
('AI/ML Engineer','Develop and evaluate applied ML systems.','{Python,Machine Learning,TensorFlow}'),
('Backend Engineer','Build APIs and data services.','{Node.js,SQL,REST APIs}'),
('Product Designer','Design useful and accessible product experiences.','{Figma,Communication}')
on conflict (title) do nothing;

insert into public.courses (provider,title,duration,level,skills,certificate_available) values
('Tech Academy','Advanced React Production Patterns','6 weeks','Intermediate','{React,TypeScript,Testing}',true),
('AeroStack Academy','AWS Cloud Practitioner','8 weeks','Beginner','{AWS,Networking}',true),
('DataCamp Campus','SQL for Analytics','4 weeks','Beginner','{SQL,PostgreSQL,Excel}',true),
('Engineering Guild','System Design Fundamentals','5 weeks','Intermediate','{System Design,REST APIs}',true);
