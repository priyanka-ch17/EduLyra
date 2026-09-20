import { useEffect, useState } from "react";
import {
  addFeedback,
  getFeedbacks,
  type Feedback,
} from "../services/feedback";
import { currentUser } from "../services/store";

export default function FeedbackSection() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(
    []
  );

  useEffect(() => {
    setFeedbacks(getFeedbacks());

    const refreshFeedbacks = () => {
      setFeedbacks(getFeedbacks());
    };

    window.addEventListener(
      "edulyra:feedback",
      refreshFeedbacks
    );

    return () => {
      window.removeEventListener(
        "edulyra:feedback",
        refreshFeedbacks
      );
    };
  }, []);

  function submitFeedback() {
    const user = currentUser();

    if (!user) {
      alert("Please log in to submit feedback.");
      return;
    }

    try {
      addFeedback(
        user.id,
        user.name,
        rating,
        comment
      );

      setComment("");
      setRating(5);
      alert("Thank you for your feedback!");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to submit feedback."
      );
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-bold">
        Share Your Feedback
      </h2>

      <div className="rounded-2xl border p-6">
        <p className="mb-2 font-medium">
          Rate your experience
        </p>

        <div className="mb-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          placeholder="Write your feedback..."
          className="mb-4 w-full rounded-xl border p-3"
          rows={4}
        />

        <button
          onClick={submitFeedback}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          Submit Feedback
        </button>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-bold">
        User Reviews
      </h2>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet. Be the first to share feedback!
          </p>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-2xl border p-5"
            >
              <h3 className="font-semibold">
                {feedback.userName}
              </h3>

              <p className="text-yellow-500">
                {"★".repeat(feedback.rating)}
                <span className="text-gray-300">
                  {"★".repeat(5 - feedback.rating)}
                </span>
              </p>

              <p className="mt-2 text-gray-700">
                {feedback.comment}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(
                  feedback.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}