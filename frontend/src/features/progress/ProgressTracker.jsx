import useProgress from "./hooks/useProgress";
import useProgressMutations from "./hooks/useProgressMutations";

function ProgressTracker({ animeId, totalEpisodes }) {
  const { data: progress, isLoading } = useProgress();
  const { createMutation, updateMutation } = useProgressMutations();

  const entry = progress?.find((item) => item.animeId === animeId);

  if (isLoading) return null;

  const handleStartTracking = () => {
    createMutation.mutate({ animeId, currentEpisode: 0 });
  };

  const setEpisode = (next) => {
    const clamped = Math.max(0, totalEpisodes ? Math.min(next, totalEpisodes) : next);
    updateMutation.mutate({ id: entry._id, currentEpisode: clamped });
  };

  if (!entry) {
    return (
      <button
        onClick={handleStartTracking}
        className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-300 hover:border-stone-500"
      >
        Start Tracking Progress
      </button>
    );
  }

  const percent = totalEpisodes ? Math.min(100, (entry.currentEpisode / totalEpisodes) * 100) : 0;

  return (
    <div className="w-full max-w-xs rounded-lg border border-stone-800 bg-stone-900/60 p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-400">Episode Progress</span>
        <span className="font-semibold text-white">
          {entry.currentEpisode}
          {totalEpisodes ? ` / ${totalEpisodes}` : ""}
        </span>
      </div>

      {totalEpisodes && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => setEpisode(entry.currentEpisode - 1)}
          className="h-7 w-7 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-white">{entry.currentEpisode}</span>
        <button
          onClick={() => setEpisode(entry.currentEpisode + 1)}
          disabled={totalEpisodes && entry.currentEpisode >= totalEpisodes}
          className="h-7 w-7 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default ProgressTracker;
