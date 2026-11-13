import { useQuery } from "@tanstack/react-query";
import { searchAnime } from "../../../services/animeApi";

const useDiscoverAnime = (filters, perPage = 15) => {
  return useQuery({
    queryKey: ["discoverAnime", filters, perPage],
    queryFn: () => searchAnime({ ...filters, perPage }),
  });
};

export default useDiscoverAnime;
