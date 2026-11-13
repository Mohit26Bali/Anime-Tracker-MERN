import { Link } from "react-router-dom";
import humanize from "../../utils/humanize";

function CharacterCard({ character }) {
  return (
    <Link
      to={`/characters/${character.id}`}
      className="group block w-32 shrink-0 snap-start overflow-hidden rounded-lg bg-stone-800 shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-300 hover:shadow-orange-900/40 hover:ring-orange-500/50 sm:w-36"
    >
      <div className="overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-44"
        />
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-semibold text-white">{character.name}</p>
        <p className="text-xs text-stone-400">{humanize(character.role)}</p>
        {character.voiceActor && (
          <p className="mt-1 truncate text-xs text-stone-500">CV: {character.voiceActor.name}</p>
        )}
      </div>
    </Link>
  );
}

export default CharacterCard;
