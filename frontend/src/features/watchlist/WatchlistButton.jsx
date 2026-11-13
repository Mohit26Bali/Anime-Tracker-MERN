import useWatchlist from "./hooks/useWatchlist";
import useWatchlistMutations from "./hooks/useWatchlistMutations";

const STATUSES = ["Watching", "Completed", "Dropped", "On Hold", "Plan To Watch"];

function WatchlistButton({ animeId }) {
  const { data: watchlist, isLoading } = useWatchlist();
  const { addMutation, updateMutation, removeMutation } = useWatchlistMutations();

  if (isLoading) return null;

  const entry = watchlist?.find((item) => item.animeId === animeId);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "REMOVE") {
      removeMutation.mutate(entry._id);
    } else if (entry) {
      updateMutation.mutate({ id: entry._id, status: value });
    } else {
      addMutation.mutate({ animeId, status: value });
    }
  };

  return (
    <select
      value={entry?.status ?? ""}
      onChange={handleChange}
      className="rounded border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-white"
    >
      <option value="" disabled>
        Add to Watchlist
      </option>
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
      {entry && <option value="REMOVE">Remove from Watchlist</option>}
    </select>
  );
}

export default WatchlistButton;
