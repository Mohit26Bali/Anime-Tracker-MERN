import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function AnimeCard({ anime, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      <Link
        to={`/anime/${anime.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg bg-stone-800 shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-300 hover:shadow-orange-900/40 hover:ring-orange-500/50"
      >
        <div className="overflow-hidden">
          <img
            src={anime.coverImage}
            alt={anime.title}
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-2">
          <p className="truncate text-sm font-semibold text-white">{anime.title}</p>
          {(anime.episodes !== undefined || anime.score !== undefined) && (
            <p className="text-xs text-stone-400">
              {anime.episodes ? `${anime.episodes} episodes` : "Ongoing"} · Score:{" "}
              {anime.score ?? "N/A"}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default AnimeCard;
