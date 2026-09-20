export const LEARNING_SUBJECTS = [
  'DBMS', 'Java', 'Python', 'Data Structures', 'Web Development', 'AI/ML',
  'Cloud Computing', 'Operating Systems', 'Computer Networks', 'Data Analytics'
] as const;

const SKILL_TO_SUBJECT: Record<string, string> = {
  sql: 'DBMS', dbms: 'DBMS', 'power bi': 'Data Analytics', statistics: 'Data Analytics', pandas: 'Python',
  python: 'Python', java: 'Java', javascript: 'Web Development', react: 'Web Development', html: 'Web Development',
  css: 'Web Development', 'data structures': 'Data Structures', dsa: 'Data Structures', 'ai / ml': 'AI/ML',
  'machine learning': 'AI/ML', aws: 'Cloud Computing', cloud: 'Cloud Computing', docker: 'Cloud Computing',
  'operating systems': 'Operating Systems', 'computer networks': 'Computer Networks'
};

export function subjectForSkill(skill?: string): string {
  const key = String(skill || '').trim().toLowerCase();
  return SKILL_TO_SUBJECT[key] || 'DBMS';
}
