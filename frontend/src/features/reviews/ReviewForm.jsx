import { useState } from "react";
import useReviewMutations from "./hooks/useReviewMutations";
import StarRating from "./StarRating";

function ReviewForm({ animeId, existingReview }) {
  const { createMutation, updateMutation } = useReviewMutations(animeId);
  const [rating, setRating] = useState(existingReview?.rating ?? 8);
  const [review, setReview] = useState(existingReview?.review ?? "");

  const mutation = existingReview ? updateMutation : createMutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingReview) {
      mutation.mutate({ id: existingReview._id, rating, review });
    } else {
      mutation.mutate({ animeId, rating, review });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg bg-stone-800 p-4">
      <div className="flex items-center gap-3">
        <StarRating value={rating} onChange={setRating} />
        <span className="text-sm text-stone-400">{rating}/10</span>
      </div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
        rows={3}
        className="rounded border border-stone-600 bg-stone-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="self-start rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
      >
        {existingReview ? "Update Review" : "Post Review"}
      </button>
    </form>
  );
}

export default ReviewForm;
