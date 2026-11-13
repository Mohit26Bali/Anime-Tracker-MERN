import { useQuery } from "@tanstack/react-query";
import { getAnimeDetails } from "../../../services/animeApi";

const useAnimeDetails = (id) => {
  return useQuery({
    queryKey: ["animeDetails", id],
    queryFn: () => getAnimeDetails(id),
    enabled: !!id,
  });
};

export default useAnimeDetails;
