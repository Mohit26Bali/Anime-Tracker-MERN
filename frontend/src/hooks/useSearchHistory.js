import { useState } from "react";

const STORAGE_KEY = "animeTracker.searchHistory";
const MAX_ITEMS = 8;

const readHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const useSearchHistory = () => {
  const [history, setHistory] = useState(readHistory);

  const addTerm = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_ITEMS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return { history, addTerm, clearHistory };
};

export default useSearchHistory;
