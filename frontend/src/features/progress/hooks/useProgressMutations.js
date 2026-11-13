import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgress, updateProgress } from "../../../services/progressApi";
import { useToast } from "../../../components/ToastProvider";

const useProgressMutations = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["progress"] });

  const createMutation = useMutation({
    mutationFn: createProgress,
    onSuccess: () => {
      invalidate();
      showToast("Progress tracking started");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProgress,
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation };
};

export default useProgressMutations;
