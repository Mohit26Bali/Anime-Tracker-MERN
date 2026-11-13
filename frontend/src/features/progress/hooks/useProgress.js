import { useQuery } from "@tanstack/react-query";
import { getProgress } from "../../../services/progressApi";

const useProgress = () => {
  return useQuery({
    queryKey: ["progress"],
    queryFn: getProgress,
  });
};

export default useProgress;
