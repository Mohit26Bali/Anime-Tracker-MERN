import { useSelector } from "react-redux";
import useComments from "./hooks/useComments";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";

function CommentSection({ reviewId }) {
  const { user } = useSelector((state) => state.auth);
  const { data: comments, isLoading } = useComments(reviewId);

  return (
    <div className="mt-3 border-t border-stone-700 pt-3">
      {user && <CommentForm reviewId={reviewId} />}
      {isLoading && <p className="text-xs text-stone-500">Loading comments...</p>}
      {comments?.map((comment) => (
        <CommentThread key={comment._id} comment={comment} reviewId={reviewId} />
      ))}
    </div>
  );
}

export default CommentSection;
