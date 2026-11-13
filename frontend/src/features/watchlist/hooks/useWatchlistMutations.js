import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
} from "../../../services/watchlistApi";
import { useToast } from "../../../components/ToastProvider";

const useWatchlistMutations = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["watchlist"] });

  const addMutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      invalidate();
      showToast("Added to Watchlist");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateWatchlistStatus,
    onSuccess: () => {
      invalidate();
      showToast("Watchlist status updated");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      invalidate();
      showToast("Removed from Watchlist");
    },
  });

  return { addMutation, updateMutation, removeMutation };
};

export default useWatchlistMutations;
