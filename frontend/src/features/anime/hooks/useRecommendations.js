import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "../../../services/animeApi";

const useRecommendations = (id) => {
  return useQuery({
    queryKey: ["recommendations", id],
    queryFn: () => getRecommendations(id),
    enabled: !!id,
  });
};

export default useRecommendations;
