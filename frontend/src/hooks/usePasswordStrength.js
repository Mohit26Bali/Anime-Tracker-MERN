import { useEffect, useState } from "react";
import useDebouncedValue from "./useDebouncedValue";
import { evaluatePassword } from "../utils/passwordPolicy";

// Returns the latest strength evaluation for `password` (null while empty or still loading).
const usePasswordStrength = (password, { username, email } = {}) => {
  const debouncedPassword = useDebouncedValue(password, 150);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!debouncedPassword) {
      setResult(null);
      return undefined;
    }
    evaluatePassword(debouncedPassword, { username, email })
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {
        // If the checker fails to load, leave the result empty; the server still enforces the policy.
        if (!cancelled) setResult(null);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedPassword, username, email]);

  // A stale result for a previous password must not be shown while the user is still typing.
  return password && debouncedPassword === password ? result : null;
};

export default usePasswordStrength;
