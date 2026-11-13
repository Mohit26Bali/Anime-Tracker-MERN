import { useQuery } from "@tanstack/react-query";
import { getWatchlist } from "../../../services/watchlistApi";

const useWatchlist = () => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });
};

export default useWatchlist;
