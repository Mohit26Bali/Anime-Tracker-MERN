import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useReviews from "./hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import Skeleton from "../../components/Skeleton";

function ReviewList({ animeId }) {
  const { user } = useSelector((state) => state.auth);
  const { data: reviews, isLoading } = useReviews(animeId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const ownReview = reviews?.find((r) => user && r.user._id === user._id);

  return (
    <div className="flex flex-col gap-4">
      {user && !ownReview && <ReviewForm animeId={animeId} />}

      {reviews?.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-800 py-10 text-center">
          <p className="text-3xl">💬</p>
          <p className="mt-2 font-semibold text-stone-200">No reviews yet</p>
          <p className="mt-1 text-sm text-stone-500">
            {user ? (
              "Be the first person to review this anime."
            ) : (
              <>
                <Link to="/login" className="text-orange-400 hover:underline">
                  Log in
                </Link>{" "}
                to be the first person to review this anime.
              </>
            )}
          </p>
        </div>
      )}

      {reviews?.map((review) => (
        <ReviewItem key={review._id} review={review} animeId={animeId} />
      ))}
    </div>
  );
}

export default ReviewList;
