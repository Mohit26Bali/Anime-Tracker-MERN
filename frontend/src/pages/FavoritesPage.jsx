import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useFavorites from "../features/favorites/hooks/useFavorites";
import useFavoriteMutations from "../features/favorites/hooks/useFavoriteMutations";
import { getAnimeDetails } from "../services/animeApi";
import AnimeCard from "../features/anime/AnimeCard";
import Skeleton from "../components/Skeleton";

function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();
  const { removeMutation } = useFavoriteMutations();

  const animeQueries = useQueries({
    queries: (favorites ?? []).map((entry) => ({
      queryKey: ["animeDetails", String(entry.animeId)],
      queryFn: () => getAnimeDetails(entry.animeId),
    })),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 px-6 py-8 text-white">
        <h1 className="mb-6 text-2xl font-bold">My Favorites</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center text-white">
        <p className="text-4xl">♡</p>
        <p className="mt-3 text-lg font-semibold">No favorites yet</p>
        <p className="mt-1 text-sm text-stone-500">
          Search for anime and favorite the ones you love.
        </p>
        <Link
          to="/search"
          className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
        >
          Browse Anime
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 px-6 py-8 text-white">
      <h1 className="mb-6 text-2xl font-bold">My Favorites</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {favorites.map((entry, index) => {
          const anime = animeQueries[index].data;
          if (!anime) return null;

          return (
            <div key={entry._id} className="flex flex-col gap-1">
              <AnimeCard anime={anime} />
              <button
                onClick={() => removeMutation.mutate(entry._id)}
                className="text-xs text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FavoritesPage;
