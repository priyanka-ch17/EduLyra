export type Role = 'student'|'faculty'|'industry'|'institution';
export interface User { id:string; name:string; email:string; role:Role; avatar?:string; profile?:Record<string,unknown>; }
export interface Application {
  id: string;
  opportunityId: string;
  company: string;
  role: string;
  appliedDate: string;

  stage:
    | 'Saved'
    | 'Applied'
    | 'Shortlisted'
    | 'AI Shortlisted'
    | 'Assessment'
    | 'Interview'
    | 'Selected'
    | 'Rejected';

  nextAction: string;
  interviewRequired?: boolean;
  interviewDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;

  type:
    | 'opportunity'
    | 'application'
    | 'learning'
    | 'system';
}
export interface Opportunity {
  id: string;
  title: string;
  company: string;

  type:
    | 'Internship'
    | 'Job'
    | 'Faculty'
    | 'Training'
    | 'Project'
    | 'Apprenticeship'
    | 'Certification'
    | 'Workshop'
    | 'Research'
    | 'FDP'
    | 'Mentorship'
    | 'Consultancy'
    | 'Challenge';

  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  compensation: string;
  duration?: string;
  skills: string[];
  eligibility: string;
  deadline: string;
  match: number;
  description: string;
}

export type AssessmentEventType =
  | 'TAB_SWITCH'
  | 'FULLSCREEN_EXIT'
  | 'ASSESSMENT_STARTED'
  | 'ASSESSMENT_SUBMITTED'
  | 'ASSESSMENT_EXPIRED';

export interface AssessmentSession {
  id: string;
  studentId: string;
  startedAt: string;
  expiresAt: string;
  status: 'active' | 'submitted' | 'expired';
  violationCount: number;
}
