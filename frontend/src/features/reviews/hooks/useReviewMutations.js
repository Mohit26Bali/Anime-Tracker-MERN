import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, updateReview, deleteReview } from "../../../services/reviewApi";
import { useToast } from "../../../components/ToastProvider";

const useReviewMutations = (animeId) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["reviews", animeId] });

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      invalidate();
      showToast("Review posted");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      invalidate();
      showToast("Review updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      invalidate();
      showToast("Review deleted");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

export default useReviewMutations;
