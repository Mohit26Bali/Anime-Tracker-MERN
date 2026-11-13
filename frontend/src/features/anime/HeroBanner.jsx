import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useAnimeDetails from "./hooks/useAnimeDetails";
import WatchlistButton from "../watchlist/WatchlistButton";
import stripHtml from "../../utils/stripHtml";

const ROTATE_MS = 7000;

function HeroBanner({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering || items.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [isHovering, items.length]);

  const active = items[activeIndex];
  const hasBanner = Boolean(active.bannerImage);

  const { data: details } = useAnimeDetails(String(active.id));

  return (
    <div
      className="relative h-[60vh] min-h-105 w-full overflow-hidden bg-stone-950"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        {hasBanner ? (
          <motion.img
            key={active.id}
            src={active.bannerImage}
            alt={active.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={active.coverImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-110 object-cover opacity-50 blur-2xl"
            />
            <img
              src={active.coverImage}
              alt={active.title}
              className="absolute top-1/2 right-8 h-[85%] -translate-y-1/2 rounded-lg object-cover shadow-2xl ring-1 ring-white/10 sm:right-20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-stone-950/90 via-stone-950/20 to-transparent" />

      <div className="relative flex h-full flex-col justify-end gap-4 px-6 pb-16 sm:px-12">
        <motion.div
          key={`content-${active.id}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl"
        >
          <h1 className="text-3xl font-extrabold text-white drop-shadow sm:text-5xl">
            {active.title}
          </h1>
          <p className="mt-2 text-sm text-stone-300">
            {active.episodes ? `${active.episodes} episodes` : "Ongoing"} · Score:{" "}
            {active.score ?? "N/A"}
          </p>
          {details?.description && (
            <p className="line-clamp-3 mt-3 text-sm text-stone-300">
              {stripHtml(details.description)}
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <Link
              to={`/anime/${active.id}`}
              className="rounded-lg bg-white px-6 py-2.5 font-semibold text-stone-900 hover:bg-stone-200"
            >
              View Details
            </Link>
            <WatchlistButton animeId={active.id} />
          </div>
        </motion.div>

        <div className="flex gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.title}`}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-orange-500" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
