import { useParams } from "react-router-dom";
import useCharacterDetails from "../features/characters/hooks/useCharacterDetails";
import SpoilerText from "../features/characters/SpoilerText";
import ScrollRow from "../components/ScrollRow";
import AnimeCard from "../features/anime/AnimeCard";
import Skeleton from "../components/Skeleton";

const Pill = ({ children }) => (
  <span className="rounded-full bg-stone-800/80 px-3 py-1 text-xs font-medium text-stone-200">
    {children}
  </span>
);

function CharacterDetailsPage() {
  const { id } = useParams();
  const { data: character, isLoading, error } = useCharacterDetails(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 px-6 py-8 sm:px-12">
        <div className="flex gap-6">
          <Skeleton className="h-56 w-40" />
          <div className="flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.response?.status === 404;
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-white">
        {isNotFound ? "Character not found." : "Something went wrong. Try again."}
      </div>
    );
  }

  const animeAppearances = character.appearances.filter((a) => a.isAnime);
  const otherAppearances = character.appearances.filter((a) => !a.isAnime);

  return (
    <div className="min-h-screen bg-stone-950 px-6 py-8 text-white sm:px-12">
      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={character.image}
          alt={character.name}
          className="h-72 w-52 shrink-0 self-start rounded-lg object-cover shadow-2xl shadow-black/50 ring-1 ring-white/10"
        />
        <div>
          <h1 className="text-3xl font-extrabold">{character.name}</h1>
          {character.nativeName && (
            <p className="mt-1 text-stone-400">{character.nativeName}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {character.gender && <Pill>{character.gender}</Pill>}
            {character.age && <Pill>Age: {character.age}</Pill>}
            {character.bloodType && <Pill>Blood Type: {character.bloodType}</Pill>}
            {character.favourites !== null && (
              <Pill>❤ {character.favourites.toLocaleString()} favorites</Pill>
            )}
          </div>

          {character.alternativeNames.length > 0 && (
            <p className="mt-3 text-sm text-stone-500">
              Also known as: {character.alternativeNames.join(", ")}
            </p>
          )}

          {character.description && (
            <div className="mt-4 max-w-2xl">
              <SpoilerText text={character.description} />
            </div>
          )}
        </div>
      </div>

      {animeAppearances.length > 0 && (
        <div className="mt-10">
          <ScrollRow title="Appears In">
            {animeAppearances.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                className="w-36 shrink-0 snap-start sm:w-40"
              />
            ))}
          </ScrollRow>
        </div>
      )}

      {otherAppearances.length > 0 && (
        <section className="mt-8 px-4 sm:px-6">
          <h2 className="mb-2 text-lg font-semibold text-stone-100">Also Appears In (Manga)</h2>
          <div className="flex flex-wrap gap-2">
            {otherAppearances.map((item) => (
              <span key={item.id} className="rounded bg-stone-800 px-3 py-1 text-sm text-stone-300">
                {item.title}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CharacterDetailsPage;
