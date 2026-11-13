import { useQuery } from "@tanstack/react-query";
import { getTrending } from "../../../services/animeApi";

const useTrending = (perPage = 20) => {
  return useQuery({
    queryKey: ["trending", perPage],
    queryFn: () => getTrending({ perPage }),
  });
};

export default useTrending;
