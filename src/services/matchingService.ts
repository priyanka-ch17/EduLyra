import type { Opportunity } from "../types";

export function explainMatch(opportunity: Opportunity, studentSkills: string[]) {
  const have = opportunity.skills.filter(s => studentSkills.some(x => x.toLowerCase() === s.toLowerCase()));
  const missing = opportunity.skills.filter(s => !have.includes(s));
  return { matchedSkills: have, missingSkills: missing, percentage: opportunity.match };
}