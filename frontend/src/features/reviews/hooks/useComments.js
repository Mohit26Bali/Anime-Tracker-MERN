import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../../services/commentApi";

const useComments = (reviewId) => {
  return useQuery({
    queryKey: ["comments", reviewId],
    queryFn: () => getComments(reviewId),
    enabled: !!reviewId,
  });
};

export default useComments;
