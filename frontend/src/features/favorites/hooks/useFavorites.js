import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../../services/favoriteApi";

const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
};

export default useFavorites;
