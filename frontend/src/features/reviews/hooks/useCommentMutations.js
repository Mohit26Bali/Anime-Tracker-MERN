import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, updateComment, deleteComment } from "../../../services/commentApi";
import { useToast } from "../../../components/ToastProvider";

const useCommentMutations = (reviewId) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      invalidate();
      showToast("Comment posted");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      invalidate();
      showToast("Comment updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      invalidate();
      showToast("Comment deleted");
    },
  });

  return { addMutation, updateMutation, deleteMutation };
};

export default useCommentMutations;
