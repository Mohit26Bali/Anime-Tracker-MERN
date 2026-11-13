import { useState } from "react";
import { motion } from "framer-motion";
import ANIME_QUOTES from "../data/animeQuotes";

const FEATURES = [
  "Track your watching progress",
  "Create and manage watchlists",
  "Favorite anime and characters",
  "Rate and review series",
  "Discover personalized recommendations",
];

function AuthLayout({ title, subtitle, children }) {
  const [quote] = useState(
    () => ANIME_QUOTES[Math.floor(Math.random() * ANIME_QUOTES.length)]
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-stone-950 text-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-linear-to-br from-orange-600/30 via-rose-600/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-linear-to-tl from-rose-600/20 via-orange-600/10 to-transparent blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h2 className="bg-linear-to-br from-white to-orange-200 bg-clip-text text-4xl font-extrabold text-transparent">
            Track. Discover. Remember.
          </h2>
          <ul className="mt-8 flex flex-col gap-3 text-stone-300">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-orange-400">✓</span> {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="relative">
          <blockquote className="border-l-2 border-orange-500/60 pl-4 text-stone-300 italic">
            "{quote.quote}"
          </blockquote>
          <p className="mt-2 pl-4 text-sm text-stone-500">— {quote.source}</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm rounded-xl border border-stone-800 bg-stone-900/60 p-8 shadow-2xl shadow-black/40"
        >
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-stone-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
