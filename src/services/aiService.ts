export interface CareerRecommendation {
  role: string;
  match: number;
  required: string[];
  missing: string[];
  courses: string[];
  projects: string[];
}

const demoRecommendations: CareerRecommendation[] = [
  { role: "Software Developer", match: 87, required: ["JavaScript", "React", "SQL", "Git"], missing: ["System Design"], courses: ["Advanced React", "System Design Fundamentals"], projects: ["Build a full-stack SaaS app"] },
  { role: "Full Stack Developer", match: 82, required: ["React", "Node.js", "SQL"], missing: ["Testing", "Docker"], courses: ["Node.js Production Patterns"], projects: ["Deploy a production-ready API"] },
  { role: "Data Analyst", match: 74, required: ["SQL", "Python", "Excel"], missing: ["Power BI"], courses: ["Power BI for Analytics"], projects: ["Build a business KPI dashboard"] },
  { role: "Cloud Engineer", match: 61, required: ["Linux", "Networking", "AWS"], missing: ["Terraform", "Docker"], courses: ["AWS Cloud Practitioner"], projects: ["Deploy a containerized web app"] },
];

export async function recommendCareer(input: { skills: string[]; interests: string }) {
  const endpoint = "/api/ai";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recommendCareer", input }),
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.recommendations)) return data.recommendations as CareerRecommendation[];
    }
  } catch {
    // Vite development has no API server by default; fall back to safe demo mode.
  }
  return demoRecommendations;
}

export async function analyzeSkills(skills: string[]) {
  const recommendations = await recommendCareer({ skills, interests: "software engineering" });
  return {
    overall: 78,
    technical: 81,
    soft: 73,
    strengths: ["JavaScript", "Problem Solving", "SQL"],
    gaps: ["Cloud Computing", "System Design", "Testing"],
    recommendations,
  };
}