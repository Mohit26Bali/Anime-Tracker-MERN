import { useEffect, useState } from "react";

const useDebouncedValue = (value, delayMs) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
};

export default useDebouncedValue;
