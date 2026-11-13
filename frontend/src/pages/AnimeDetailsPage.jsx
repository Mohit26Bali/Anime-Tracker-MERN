import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useAnimeDetails from "../features/anime/hooks/useAnimeDetails";
import useRecommendations from "../features/anime/hooks/useRecommendations";
import CharacterCard from "../features/anime/CharacterCard";
import AnimeCard from "../features/anime/AnimeCard";
import WatchlistButton from "../features/watchlist/WatchlistButton";
import FavoriteButton from "../features/favorites/FavoriteButton";
import ReviewList from "../features/reviews/ReviewList";
import ProgressTracker from "../features/progress/ProgressTracker";
import InfoSidebar from "../features/anime/InfoSidebar";
import RelationsRow from "../features/anime/RelationsRow";
import CollapsibleText from "../features/anime/CollapsibleText";
import ScrollRow from "../components/ScrollRow";
import Skeleton from "../components/Skeleton";
import stripHtml from "../utils/stripHtml";
import humanize from "../utils/humanize";

const Pill = ({ children }) => (
  <span className="rounded-full bg-stone-800/80 px-3 py-1 text-xs font-medium text-stone-200">
    {children}
  </span>
);

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-stone-950">
      <Skeleton className="h-[45vh] w-full rounded-none" />
      <div className="px-6 py-8">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-3 h-4 w-2/3" />
        <Skeleton className="mt-6 h-32 w-full" />
      </div>
    </div>
  );
}

function AnimeDetailsPage() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: anime, isLoading, error } = useAnimeDetails(id);
  const { data: recommendations } = useRecommendations(id);

  if (isLoading) return <DetailsSkeleton />;

  if (error) {
    const isNotFound = error.response?.status === 404;
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-white">
        {isNotFound ? "Anime not found." : "Something went wrong. Try again."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="relative h-[45vh] min-h-80 w-full">
        <img
          src={anime.bannerImage || anime.coverImage}
          alt={anime.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/50 to-stone-950/10" />
      </div>

      <div className="relative -mt-24 flex gap-6 px-6 sm:-mt-32 sm:px-12">
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="h-36 w-24 shrink-0 rounded-lg object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:h-48 sm:w-32"
        />
        <div className="flex flex-1 flex-col justify-end pb-1">
          <h1 className="text-2xl font-extrabold text-white drop-shadow sm:text-4xl">
            {anime.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {anime.score && <Pill>⭐ {anime.score}%</Pill>}
            {anime.format && <Pill>📺 {humanize(anime.format)}</Pill>}
            <Pill>🎬 {anime.episodes ? `${anime.episodes} episodes` : "Ongoing"}</Pill>
            {anime.duration && <Pill>🕒 {anime.duration} min</Pill>}
            {anime.season && (
              <Pill>
                📅 {humanize(anime.season)} {anime.seasonYear}
              </Pill>
            )}
            {anime.studio && <Pill>🏢 {anime.studio}</Pill>}
            <Pill>{humanize(anime.status)}</Pill>
          </div>
        </div>
      </div>

      <div className="sticky top-14 z-10 mt-6 flex flex-wrap items-center gap-3 border-y border-stone-800 bg-stone-950/90 px-6 py-3 backdrop-blur sm:px-12">
        {user ? (
          <>
            <WatchlistButton animeId={anime.id} />
            <FavoriteButton animeId={anime.id} />
            <ProgressTracker animeId={anime.id} totalEpisodes={anime.episodes} />
          </>
        ) : (
          <Link to="/login" className="text-sm text-orange-400 hover:underline">
            Log in to track or favorite this anime
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 px-6 py-8 sm:px-12 md:grid-cols-3">
        <div className="flex flex-col gap-10 md:col-span-2">
          <section>
            <h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
            <CollapsibleText text={stripHtml(anime.description)} />
          </section>

          {anime.characters.main.length > 0 && (
            <ScrollRow title="Main Cast">
              {anime.characters.main.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </ScrollRow>
          )}

          {anime.characters.supporting.length > 0 && (
            <ScrollRow title="Supporting Cast">
              {anime.characters.supporting.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </ScrollRow>
          )}

          <RelationsRow relations={anime.relations} />

          {recommendations?.results.length > 0 && (
            <ScrollRow title="Recommended">
              {recommendations.results.map(({ anime: rec }) => (
                <AnimeCard key={rec.id} anime={rec} className="w-36 shrink-0 snap-start sm:w-40" />
              ))}
            </ScrollRow>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
            <ReviewList animeId={anime.id} />
          </section>
        </div>

        <div className="self-start md:sticky md:top-32">
          <InfoSidebar anime={anime} />
        </div>
      </div>
    </div>
  );
}

export default AnimeDetailsPage;
