import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "../../../services/favoriteApi";
import { useToast } from "../../../components/ToastProvider";

const useFavoriteMutations = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["favorites"] });

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      invalidate();
      showToast("Added to Favorites");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      invalidate();
      showToast("Removed from Favorites");
    },
  });

  return { addMutation, removeMutation };
};

export default useFavoriteMutations;
