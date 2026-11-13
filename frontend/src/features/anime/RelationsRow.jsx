import { Link } from "react-router-dom";
import ScrollRow from "../../components/ScrollRow";
import humanize from "../../utils/humanize";

function RelationCard({ relation }) {
  const content = (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg bg-stone-800 shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-300 hover:shadow-orange-900/40 hover:ring-orange-500/50">
      <div className="overflow-hidden">
        <img
          src={relation.coverImage}
          alt={relation.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-orange-400">
          {humanize(relation.relationType)}
        </p>
        <p className="truncate text-sm text-white">{relation.title}</p>
        <p className="text-xs text-stone-400">{humanize(relation.format)}</p>
      </div>
    </div>
  );

  if (!relation.isAnime) {
    return <div className="w-36 shrink-0 snap-start opacity-70 sm:w-40">{content}</div>;
  }

  return (
    <Link to={`/anime/${relation.id}`} className="block w-36 shrink-0 snap-start sm:w-40">
      {content}
    </Link>
  );
}

function RelationsRow({ relations }) {
  if (!relations || relations.length === 0) return null;

  return (
    <ScrollRow title="Relations">
      {relations.map((relation) => (
        <RelationCard key={relation.id} relation={relation} />
      ))}
    </ScrollRow>
  );
}

export default RelationsRow;
