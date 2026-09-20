import type {
  AssessmentEventType,
  AssessmentSession,
} from "../types";

const SESSION_KEY = "edulyra_assessment_session";

const EVENTS_KEY = "edulyra_assessment_events";

const ASSESSMENT_DURATION_MINUTES = 15;

// Start a new assessment session
export function startAssessment(
  studentId: string
): AssessmentSession {
  const now = new Date();

  const expiresAt = new Date(
    now.getTime() +
      ASSESSMENT_DURATION_MINUTES * 60 * 1000
  );

  const session: AssessmentSession = {
    id: crypto.randomUUID(),
    studentId,
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: "active",
    violationCount: 0,
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

// Get the current assessment session
export function getAssessmentSession():
  AssessmentSession | null {
  const saved = localStorage.getItem(SESSION_KEY);

  if (!saved) return null;

  try {
    return JSON.parse(saved) as AssessmentSession;
  } catch (error) {
    console.error(
      "Failed to parse assessment session:",
      error
    );

    return null;
  }
}

// Calculate remaining time in seconds
export function getRemainingTime(
  session: AssessmentSession
): number {
  const remaining =
    new Date(session.expiresAt).getTime() -
    Date.now();

  return Math.max(
    0,
    Math.floor(remaining / 1000)
  );
}

// Record assessment events
export function recordAssessmentEvent(
  eventType: AssessmentEventType
): void {
  const session = getAssessmentSession();

  if (!session) return;

  let events: Array<{
    id: string;
    sessionId: string;
    studentId: string;
    eventType: AssessmentEventType;
    createdAt: string;
  }> = [];

  try {
    events = JSON.parse(
      localStorage.getItem(EVENTS_KEY) || "[]"
    );
  } catch (error) {
    console.error(
      "Failed to parse assessment events:",
      error
    );
  }

  events.push({
    id: crypto.randomUUID(),
    sessionId: session.id,
    studentId: session.studentId,
    eventType,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(
    EVENTS_KEY,
    JSON.stringify(events)
  );

  // Count only violations
  if (
    eventType === "TAB_SWITCH" ||
    eventType === "FULLSCREEN_EXIT"
  ) {
    session.violationCount += 1;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );
  }
}

// Mark assessment as expired
export function markAssessmentExpired(): void {
  const session = getAssessmentSession();

  if (!session) return;

  session.status = "expired";

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );
}

// Clear the current assessment session
export function clearAssessmentSession(): void {
  localStorage.removeItem(SESSION_KEY);
}