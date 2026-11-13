import { Link } from "react-router-dom";
import humanize from "../../utils/humanize";

function InfoRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-stone-800 py-2 text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="text-right text-stone-200">{value}</span>
    </div>
  );
}

function ChipRow({ label, items, paramName }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="border-b border-stone-800 py-2 text-sm">
      <span className="text-stone-500">{label}</span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Link
            key={item}
            to={`/search?${paramName}=${encodeURIComponent(item)}`}
            className="rounded bg-stone-800 px-2 py-0.5 text-xs text-stone-300 transition-colors hover:bg-orange-600 hover:text-white"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

function InfoSidebar({ anime }) {
  return (
    <aside className="rounded-lg border border-stone-800 bg-stone-900/60 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-400">
        Information
      </h2>
      <InfoRow label="Format" value={humanize(anime.format)} />
      <InfoRow label="Status" value={humanize(anime.status)} />
      <InfoRow label="Episodes" value={anime.episodes} />
      <InfoRow label="Duration" value={anime.duration ? `${anime.duration} min` : null} />
      <InfoRow label="Source" value={humanize(anime.source)} />
      <InfoRow
        label="Season"
        value={anime.season ? `${humanize(anime.season)} ${anime.seasonYear ?? ""}` : null}
      />
      <InfoRow label="Studio" value={anime.studio} />
      <InfoRow label="Score" value={anime.score ? `${anime.score}%` : null} />
      <InfoRow label="Popularity" value={anime.popularity ? `#${anime.rankings.seasonPopular ?? "—"}` : null} />
      <InfoRow label="Favourites" value={anime.favourites?.toLocaleString()} />
      <InfoRow
        label="Rank"
        value={anime.rankings.allTimeRated ? `#${anime.rankings.allTimeRated} All Time` : null}
      />
      <ChipRow label="Genres" items={anime.genres} paramName="genre" />
      <ChipRow label="Themes" items={anime.tags} paramName="tag" />
    </aside>
  );
}

export default InfoSidebar;
