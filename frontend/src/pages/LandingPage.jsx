import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Discover",
    description: "Search thousands of anime and browse what's trending right now, powered by AniList.",
  },
  {
    title: "Track",
    description: "Keep a watchlist with real status — watching, completed, on hold, plan to watch.",
  },
  {
    title: "Discuss",
    description: "Rate, review, and reply in threaded discussions with other fans.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function LandingPage() {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950 text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-linear-to-br from-orange-600/40 via-rose-600/30 to-transparent blur-3xl" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="max-w-3xl bg-linear-to-br from-white via-orange-100 to-orange-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
        >
          Track every anime you've ever watched
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-6 max-w-xl text-lg text-stone-400">
          Search, track your progress, favorite what you love, and join the conversation — all
          in one place.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-900/40 hover:bg-orange-500"
            >
              Get Started
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/search"
              className="block rounded-lg border border-stone-700 px-6 py-3 font-semibold text-stone-200 hover:border-stone-500"
            >
              Browse Anime
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      <section className="relative mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-24 sm:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-stone-800 bg-stone-900/60 p-6"
          >
            <h3 className="text-lg font-semibold text-orange-400">{feature.title}</h3>
            <p className="mt-2 text-sm text-stone-400">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;
