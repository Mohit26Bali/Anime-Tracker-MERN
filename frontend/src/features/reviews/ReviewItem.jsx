import { useState } from "react";
import { useSelector } from "react-redux";
import useReviewMutations from "./hooks/useReviewMutations";
import ReviewForm from "./ReviewForm";
import CommentSection from "./CommentSection";
import StarRating from "./StarRating";
import formatRelativeTime from "../../utils/formatRelativeTime";

function ReviewItem({ review, animeId }) {
  const { user } = useSelector((state) => state.auth);
  const { deleteMutation } = useReviewMutations(animeId);
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = user && user._id === review.user._id;

  if (isEditing) {
    return <ReviewForm animeId={animeId} existingReview={review} />;
  }

  return (
    <div className="rounded-lg bg-stone-800 p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-stone-200">{review.user.username}</span>
        <span className="text-xs text-stone-500">{formatRelativeTime(review.createdAt)}</span>
      </div>
      <div className="mt-1">
        <StarRating value={review.rating} readOnly />
      </div>
      <p className="mt-2 text-sm text-stone-300">{review.review}</p>

      {isOwner && (
        <div className="mt-2 flex gap-3 text-xs text-stone-500">
          <button onClick={() => setIsEditing(true)} className="hover:text-stone-300">
            Edit
          </button>
          <button
            onClick={() => deleteMutation.mutate(review._id)}
            className="hover:text-red-400"
          >
            Delete
          </button>
        </div>
      )}

      <CommentSection reviewId={review._id} />
    </div>
  );
}

export default ReviewItem;
