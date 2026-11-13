import { useInfiniteQuery } from "@tanstack/react-query";
import { searchAnime } from "../../../services/animeApi";

const useAnimeSearch = (q, filters = {}) => {
  const { genre, format, status, sort } = filters;

  return useInfiniteQuery({
    queryKey: ["animeSearch", q, genre, format, status, sort],
    queryFn: ({ pageParam }) => searchAnime({ q, pageParam, genre, format, status, sort }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
    enabled: q.trim().length > 0 || !!genre || !!format || !!status,
  });
};

export default useAnimeSearch;
