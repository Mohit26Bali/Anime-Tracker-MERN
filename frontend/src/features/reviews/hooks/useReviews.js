import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../../../services/reviewApi";

const useReviews = (animeId) => {
  return useQuery({
    queryKey: ["reviews", animeId],
    queryFn: () => getReviews(animeId),
    enabled: !!animeId,
  });
};

export default useReviews;
