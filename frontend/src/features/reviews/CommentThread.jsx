import { useState } from "react";
import { useSelector } from "react-redux";
import useCommentMutations from "./hooks/useCommentMutations";
import CommentForm from "./CommentForm";

function CommentThread({ comment, reviewId, depth = 0 }) {
  const { user } = useSelector((state) => state.auth);
  const { deleteMutation } = useCommentMutations(reviewId);
  const [isReplying, setIsReplying] = useState(false);

  const isOwner = user && user._id === comment.user._id;

  return (
    <div className={depth > 0 ? "mt-2 ml-6 border-l border-stone-700 pl-3" : "mt-3"}>
      <p className="text-sm">
        <span className="font-semibold text-stone-200">{comment.user.username}</span>{" "}
        <span className="text-stone-300">{comment.text}</span>
      </p>
      <div className="mt-1 flex gap-3 text-xs text-stone-500">
        {user && (
          <button onClick={() => setIsReplying((v) => !v)} className="hover:text-stone-300">
            Reply
          </button>
        )}
        {isOwner && (
          <button
            onClick={() => deleteMutation.mutate({ reviewId, id: comment._id })}
            className="hover:text-red-400"
          >
            Delete
          </button>
        )}
      </div>

      {isReplying && (
        <CommentForm
          reviewId={reviewId}
          parentComment={comment._id}
          onDone={() => setIsReplying(false)}
        />
      )}

      {comment.replies.map((reply) => (
        <CommentThread key={reply._id} comment={reply} reviewId={reviewId} depth={depth + 1} />
      ))}
    </div>
  );
}

export default CommentThread;
