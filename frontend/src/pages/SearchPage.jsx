import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../features/anime/SearchBar";
import AnimeCard from "../features/anime/AnimeCard";
import SearchFilters from "../features/anime/SearchFilters";
import useAnimeSearch from "../features/anime/hooks/useAnimeSearch";
import useCharacterSearch from "../features/characters/hooks/useCharacterSearch";
import CharacterCard from "../features/anime/CharacterCard";
import useDebouncedValue from "../hooks/useDebouncedValue";
import useSearchHistory from "../hooks/useSearchHistory";

const TABS = [
  { key: "anime", label: "Anime" },
  { key: "character", label: "Characters" },
];

function useInfiniteScrollTrigger(hasNextPage, isFetchingNextPage, fetchNextPage) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return sentinelRef;
}

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("anime");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 400);
  const { history, addTerm, clearHistory } = useSearchHistory();

  useEffect(() => {
    const genre = searchParams.get("genre");
    const tag = searchParams.get("tag");
    if (genre || tag) {
      setTab("anime");
      setFilters((prev) => ({ ...prev, genre: genre || undefined, tag: tag || undefined }));
    }
  }, [searchParams]);

  const animeSearch = useAnimeSearch(debouncedQuery, filters);
  const characterSearch = useCharacterSearch(debouncedQuery);

  const active = tab === "anime" ? animeSearch : characterSearch;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = active;

  const sentinelRef = useInfiniteScrollTrigger(hasNextPage, isFetchingNextPage, fetchNextPage);

  const results = data?.pages.flatMap((page) => page.results) ?? [];
  const hasFilters = Object.values(filters).some(Boolean);
  const hasSearched = debouncedQuery.trim().length > 0 || hasFilters;
  const suggestions = tab === "anime" ? results.slice(0, 5) : [];

  const commitSearch = (term) => {
    setQuery(term);
    addTerm(term);
    setIsFocused(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 px-6 py-8 text-white">
      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-orange-600 text-white" : "bg-stone-800 text-stone-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filters.genre && (
        <p className="mb-2 text-sm text-stone-400">
          Genre: <span className="text-orange-400">{filters.genre}</span>
        </p>
      )}
      {filters.tag && (
        <p className="mb-2 text-sm text-stone-400">
          Theme: <span className="text-orange-400">{filters.tag}</span>
        </p>
      )}

      <div className="relative max-w-md">
        <SearchBar
          value={query}
          onChange={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />

        {isFocused && query.trim().length === 0 && history.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-stone-700 bg-stone-800 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-stone-500">Recent searches</span>
              <button onClick={clearHistory} className="text-xs text-stone-500 hover:text-stone-300">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((term) => (
                <button
                  key={term}
                  onClick={() => commitSearch(term)}
                  className="rounded-full bg-stone-700 px-3 py-1 text-xs text-stone-200 hover:bg-stone-600"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {isFocused && tab === "anime" && query.trim().length > 0 && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-stone-700 bg-stone-800 p-2">
            {suggestions.map((anime) => (
              <a
                key={anime.id}
                href={`/anime/${anime.id}`}
                onClick={() => addTerm(query)}
                className="flex items-center gap-3 rounded p-2 hover:bg-stone-700"
              >
                <img src={anime.coverImage} alt={anime.title} className="h-10 w-8 rounded object-cover" />
                <span className="truncate text-sm text-stone-200">{anime.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {tab === "anime" && (
        <div className="mt-3">
          <SearchFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {isLoading && <p className="mt-4 text-stone-400">Searching...</p>}

      {isError && (
        <div className="mt-10 rounded-lg border border-dashed border-red-900/50 py-10 text-center">
          <p className="text-3xl">⚠</p>
          <p className="mt-2 font-semibold text-red-400">Something went wrong</p>
          <p className="mt-1 text-sm text-stone-500">Please try again.</p>
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-stone-800 py-10 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-2 font-semibold text-stone-200">No results found</p>
          <p className="mt-1 text-sm text-stone-500">Try a different search term or filter.</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {tab === "anime"
          ? results.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
          : results.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
      </div>

      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center text-stone-400">Loading more...</p>}
    </div>
  );
}

export default SearchPage;
