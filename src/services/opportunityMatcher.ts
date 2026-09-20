export type SkillMatchResult = {
  opportunityId: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
};

export function calculateSkillMatch(
  studentSkills: string[],
  requiredSkills: string[]
): SkillMatchResult {
  const normalizedStudentSkills = studentSkills.map(
    (skill) => skill.trim().toLowerCase()
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    normalizedStudentSkills.includes(
      skill.trim().toLowerCase()
    )
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !normalizedStudentSkills.includes(
        skill.trim().toLowerCase()
      )
  );

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / requiredSkills.length) *
            100
        );

  return {
    opportunityId: "",
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
}