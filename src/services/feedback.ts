export type Feedback = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const FEEDBACK_KEY = "edulyra_feedback";

function readFeedbacks(): Feedback[] {
  try {
    return JSON.parse(
      localStorage.getItem(FEEDBACK_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function saveFeedbacks(feedbacks: Feedback[]) {
  localStorage.setItem(
    FEEDBACK_KEY,
    JSON.stringify(feedbacks)
  );

  window.dispatchEvent(
    new Event("edulyra:feedback")
  );
}

export function getFeedbacks(): Feedback[] {
  return readFeedbacks();
}

export function addFeedback(
  userId: string,
  userName: string,
  rating: number,
  comment: string
): Feedback {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  if (!comment.trim()) {
    throw new Error("Please enter your feedback.");
  }

  const feedback: Feedback = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `feedback_${Date.now()}`,
    userId,
    userName,
    rating,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  const feedbacks = readFeedbacks();

  saveFeedbacks([feedback, ...feedbacks]);

  return feedback;
}

export function deleteFeedback(id: string) {
  const feedbacks = readFeedbacks().filter(
    (feedback) => feedback.id !== id
  );

  saveFeedbacks(feedbacks);
}