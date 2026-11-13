import { motion } from "framer-motion";
import useFavorites from "./hooks/useFavorites";
import useFavoriteMutations from "./hooks/useFavoriteMutations";

function FavoriteButton({ animeId }) {
  const { data: favorites, isLoading } = useFavorites();
  const { addMutation, removeMutation } = useFavoriteMutations();

  if (isLoading) return null;

  const entry = favorites?.find((item) => item.animeId === animeId);

  const handleClick = () => {
    if (entry) {
      removeMutation.mutate(entry._id);
    } else {
      addMutation.mutate(animeId);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={`rounded px-3 py-2 text-sm font-semibold transition-colors ${
        entry ? "bg-pink-600 text-white" : "border border-stone-600 text-stone-300"
      }`}
    >
      <motion.span
        key={entry ? "favorited" : "not-favorited"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="inline-block"
      >
        {entry ? "♥ Favorited" : "♡ Add to Favorites"}
      </motion.span>
    </motion.button>
  );
}

export default FavoriteButton;
