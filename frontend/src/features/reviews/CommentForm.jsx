import { useState } from "react";
import useCommentMutations from "./hooks/useCommentMutations";

function CommentForm({ reviewId, parentComment = null, onDone }) {
  const { addMutation } = useCommentMutations(reviewId);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(
      { reviewId, text, parentComment },
      {
        onSuccess: () => {
          setText("");
          onDone?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentComment ? "Write a reply..." : "Add a comment..."}
        required
        className="flex-1 rounded border border-stone-600 bg-stone-900 px-2 py-1 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
      />
      <button
        type="submit"
        disabled={addMutation.isPending}
        className="rounded bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-500 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}

export default CommentForm;
