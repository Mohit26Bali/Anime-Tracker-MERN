const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const FORMATS = [
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Movie" },
  { value: "SPECIAL", label: "Special" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MUSIC", label: "Music" },
];

const STATUSES = [
  { value: "RELEASING", label: "Releasing" },
  { value: "FINISHED", label: "Finished" },
  { value: "NOT_YET_RELEASED", label: "Not Yet Released" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "HIATUS", label: "Hiatus" },
];

const SORTS = [
  { value: "", label: "Relevance" },
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "START_DATE_DESC", label: "Newest" },
];

const selectClass =
  "rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-sm text-stone-200 outline-none focus:border-orange-500";

function SearchFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value || undefined });

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.genre ?? ""}
        onChange={(e) => update("genre", e.target.value)}
        className={selectClass}
      >
        <option value="">All Genres</option>
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <select
        value={filters.format ?? ""}
        onChange={(e) => update("format", e.target.value)}
        className={selectClass}
      >
        <option value="">All Formats</option>
        {FORMATS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        value={filters.status ?? ""}
        onChange={(e) => update("status", e.target.value)}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort ?? ""}
        onChange={(e) => update("sort", e.target.value)}
        className={selectClass}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchFilters;
