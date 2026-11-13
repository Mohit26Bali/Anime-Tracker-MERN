import { useQueries } from "@tanstack/react-query";
import useTrending from "../features/anime/hooks/useTrending";
import useRecommendations from "../features/anime/hooks/useRecommendations";
import useDiscoverAnime from "../features/anime/hooks/useDiscoverAnime";
import useWatchlist from "../features/watchlist/hooks/useWatchlist";
import useFavorites from "../features/favorites/hooks/useFavorites";
import useProgress from "../features/progress/hooks/useProgress";
import { getAnimeDetails } from "../services/animeApi";
import getCurrentSeason from "../utils/getCurrentSeason";
import HeroBanner from "../features/anime/HeroBanner";
import AnimeCard from "../features/anime/AnimeCard";
import ScrollRow from "../components/ScrollRow";

const ROW_CARD_CLASS = "w-36 shrink-0 snap-start sm:w-40";

function useMergedAnimeEntries(entries) {
  const animeQueries = useQueries({
    queries: (entries ?? []).map((entry) => ({
      queryKey: ["animeDetails", String(entry.animeId)],
      queryFn: () => getAnimeDetails(entry.animeId),
    })),
  });

  return animeQueries.map((q) => q.data).filter(Boolean);
}

function DiscoverRow({ title, filters }) {
  const { data } = useDiscoverAnime(filters);
  if (!data || data.results.length === 0) return null;

  return (
    <ScrollRow title={title}>
      {data.results.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} className={ROW_CARD_CLASS} />
      ))}
    </ScrollRow>
  );
}

function BrowsePage() {
  const { data: trending } = useTrending(20);
  const { data: watchlist } = useWatchlist();
  const { data: favorites } = useFavorites();
  const { data: progress } = useProgress();
  const { season, seasonYear } = getCurrentSeason();

  const watchlistAnime = useMergedAnimeEntries(watchlist);
  const inProgressAnime = useMergedAnimeEntries(
    progress?.filter((p) => p.currentEpisode > 0)
  );

  const recommendationSeedId = favorites?.[0]?.animeId ?? watchlist?.[0]?.animeId;
  const { data: recommendations } = useRecommendations(recommendationSeedId);

  if (!trending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-white">
        Loading...
      </div>
    );
  }

  const bannerCandidates = trending.results.filter((anime) => anime.bannerImage);
  const heroItems = (bannerCandidates.length >= 5 ? bannerCandidates : trending.results).slice(
    0,
    5
  );

  return (
    <div className="min-h-screen bg-stone-950 pb-16 text-white">
      <HeroBanner items={heroItems} />

      <div className="mt-8 flex flex-col gap-8">
        <ScrollRow title="Trending Now">
          {trending.results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} className={ROW_CARD_CLASS} />
          ))}
        </ScrollRow>

        {inProgressAnime.length > 0 && (
          <ScrollRow title="Continue Watching">
            {inProgressAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} className={ROW_CARD_CLASS} />
            ))}
          </ScrollRow>
        )}

        {watchlistAnime.length > 0 && (
          <ScrollRow title="Your Watchlist">
            {watchlistAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} className={ROW_CARD_CLASS} />
            ))}
          </ScrollRow>
        )}

        {recommendations?.results.length > 0 && (
          <ScrollRow title="Recommended For You">
            {recommendations.results.map(({ anime }) => (
              <AnimeCard key={anime.id} anime={anime} className={ROW_CARD_CLASS} />
            ))}
          </ScrollRow>
        )}

        <DiscoverRow
          title="This Season"
          filters={{ season, seasonYear, sort: "POPULARITY_DESC" }}
        />
        <DiscoverRow title="Top Rated" filters={{ sort: "SCORE_DESC" }} />
        <DiscoverRow title="Action" filters={{ genre: "Action", sort: "POPULARITY_DESC" }} />
        <DiscoverRow title="Romance" filters={{ genre: "Romance", sort: "POPULARITY_DESC" }} />
      </div>
    </div>
  );
}

export default BrowsePage;
