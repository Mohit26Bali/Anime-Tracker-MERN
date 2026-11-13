import { useInfiniteQuery } from "@tanstack/react-query";
import { searchCharacters } from "../../../services/characterApi";

const useCharacterSearch = (q) => {
  return useInfiniteQuery({
    queryKey: ["characterSearch", q],
    queryFn: ({ pageParam }) => searchCharacters({ q, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
    enabled: q.trim().length > 0,
  });
};

export default useCharacterSearch;
