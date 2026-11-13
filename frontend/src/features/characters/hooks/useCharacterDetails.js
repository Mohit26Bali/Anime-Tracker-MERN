import { useQuery } from "@tanstack/react-query";
import { getCharacterDetails } from "../../../services/characterApi";

const useCharacterDetails = (id) => {
  return useQuery({
    queryKey: ["characterDetails", id],
    queryFn: () => getCharacterDetails(id),
    enabled: !!id,
  });
};

export default useCharacterDetails;
