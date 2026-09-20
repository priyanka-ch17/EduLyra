import type { Opportunity } from "../types";

export type IntelligenceSnapshot = {
  readiness: number;
  dimensions: Record<string, number>;
  skills: Array<{ name: string; level: number; demand: number; gap: number }>;
  gaps: Array<{ name: string; priority: "Critical"|"High"|"Medium"|"Low"; demand: number; level: number; impact: number }>;
  resumeStrength: number;
  profileCompletion: number;
};

const DEMAND: Record<string, number> = {
  Python: 91, Java: 82, SQL: 88, "AI / ML": 94, Cloud: 88, React: 84,
  Docker: 79, "Power BI": 78, Statistics: 81, Pandas: 86, JavaScript: 85,
  "Spring Boot": 80, Git: 76, HTML: 72, CSS: 70, Excel: 74, "Data Structures": 83,
  "System Design": 77, "Communication": 68
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const findLevel = (name: string, skills: string[], assessment: any, learning: any[]) => {
  const exact = skills.find(s => norm(s) === norm(name));
  if (exact) {
    const seed = 62 + ((name.length * 7) % 29);
    const assessed = Number(assessment?.domainScores?.[name] ?? 0);
    const learned = learning.some(x => (x.skills || []).some((s:string) => norm(s) === norm(name) && x.progress >= 80)) ? 8 : 0;
    return Math.min(95, Math.max(seed, assessed, seed + learned));
  }
  const assessed = Number(assessment?.domainScores?.[name] ?? 0);
  return Math.min(95, assessed || 0);
};

export function buildIntelligence(user: any): IntelligenceSnapshot {
  const profile = user?.profile || {};
  const assessment = user?.assessment || {};
  const learning = user?.learning || [];
  const skills = Array.from(new Set([...(profile.currentSkills || []), ...(user?.portfolio?.skills || [])])) as string[];
  const relevant = Array.from(new Set([...skills, ...Object.keys(DEMAND)])).slice(0, 14);
  const skillRows = relevant.map(name => {
    const level = findLevel(name, skills, assessment, learning);
    const demand = DEMAND[name] ?? 70;
    return { name, level, demand, gap: Math.max(0, demand - level) };
  });
  const assessed = Number(assessment.overall || 0);
  const technical = Number(assessment.technical || assessed || 55);
  const projects = Math.min(100, 45 + (user?.portfolio?.projects?.length || 0) * 18);
  const certifications = Math.min(100, 35 + (user?.portfolio?.certifications?.length || 0) * 22);
  const communication = Number(assessment.communication || 60);
  const internship = Math.min(100, 35 + (user?.portfolio?.internships?.length || 0) * 30);
  const interview = Math.min(100, 50 + (assessment.problemSolving || 0) * 0.35);
  const industryAlignment = skillRows.length ? Math.round(skillRows.reduce((a, x) => a + Math.min(100, x.level + Math.max(0, 20 - x.gap)), 0) / skillRows.length) : 45;
  const dimensions = {
    "Technical Skills": Math.round(technical),
    Projects: Math.round(projects),
    Certifications: Math.round(certifications),
    Communication: Math.round(communication),
    "Internship Experience": Math.round(internship),
    "Interview Readiness": Math.round(interview),
    "Industry Alignment": Math.round(industryAlignment),
    "Portfolio Strength": Math.round(Math.min(100, (projects + certifications + (profile.about ? 20 : 0)) / 2))
  };
  const readiness = Math.round(Object.values(dimensions).reduce((a,b)=>a+b,0) / Object.values(dimensions).length);
  const gaps = skillRows
    .filter(x => x.gap >= 10)
    .sort((a,b)=> (b.gap + b.demand * .15) - (a.gap + a.demand * .15))
    .slice(0, 6)
    .map(x => ({
      name: x.name,
      priority: x.gap >= 30 ? "Critical" : x.gap >= 20 ? "High" : x.gap >= 12 ? "Medium" : "Low",
      demand: x.demand,
      level: x.level,
      impact: Math.max(2, Math.round(x.gap * .16))
    } as const));
  const profileFields = ["about","education","careerGoal","desiredJobRole","currentSkills"];
  const profileCompletion = Math.min(100, Math.round(profileFields.filter(k => {
    const v = profile[k]; return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length / profileFields.length * 100));
  const resumeStrength = Math.min(100, Math.round((dimensions["Portfolio Strength"] + dimensions["Industry Alignment"] + profileCompletion) / 3));
  return { readiness, dimensions, skills: skillRows, gaps, resumeStrength, profileCompletion };
}

export function explainOpportunity(opportunity: Opportunity, user: any) {
  const skills = (user?.profile?.currentSkills || []) as string[];
  const matched = opportunity.skills.filter(req => skills.some(s => norm(s) === norm(req)));
  const missing = opportunity.skills.filter(req => !matched.includes(req));
  const match = Math.min(99, Math.round(45 + matched.length / Math.max(1, opportunity.skills.length) * 45 + (user?.assessment?.overall || 0) * .1));
  return { match, matched, missing };
}
