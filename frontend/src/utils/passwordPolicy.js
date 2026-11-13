// Client-side mirror of backend/utils/passwordPolicy.js, used for instant feedback only.
// The backend is the authority and re-checks every registration; keep the two rule sets in sync.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_BYTES = 72; // bcrypt only uses the first 72 bytes
export const PASSWORD_MIN_SCORE = 3; // zxcvbn: 0 very weak ... 4 very strong

export const SCORE_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

// The zxcvbn dictionaries are large, so they are loaded on demand (only the register page needs them).
let checkerPromise = null;
const loadChecker = () => {
  checkerPromise ??= Promise.all([
    import("@zxcvbn-ts/core"),
    import("@zxcvbn-ts/language-common"),
    import("@zxcvbn-ts/language-en"),
  ]).then(
    ([core, common, en]) =>
      new core.ZxcvbnFactory({
        translations: en.translations,
        graphs: common.adjacencyGraphs,
        dictionary: { ...common.dictionary, ...en.dictionary },
      })
  );
  return checkerPromise;
};

const personalTokens = ({ username, email }) => {
  const tokens = [];
  if (typeof username === "string" && username.trim().length >= 3) tokens.push(username.trim());
  if (typeof email === "string" && email.includes("@")) {
    const local = email.split("@")[0].trim();
    if (local.length >= 3) tokens.push(local);
  }
  return tokens;
};

/**
 * Evaluates a password. `rules` is a checklist for the UI; `ok` is true only when every rule passes.
 */
export const evaluatePassword = async (password, { username, email } = {}) => {
  const tokens = personalTokens({ username, email });
  const lowered = password.toLowerCase();

  const lengthOk = [...password].length >= PASSWORD_MIN_LENGTH;
  const bytesOk = new TextEncoder().encode(password).length <= PASSWORD_MAX_BYTES;
  const notBlank = password.trim().length > 0;
  const noPersonal = !tokens.some((t) => lowered.includes(t.toLowerCase()));

  const checker = await loadChecker();
  const result = checker.check(password.slice(0, 100), tokens);
  const strongOk = result.score >= PASSWORD_MIN_SCORE;

  const rules = [
    { id: "length", label: `At least ${PASSWORD_MIN_LENGTH} characters`, passed: lengthOk && notBlank },
    { id: "personal", label: "Doesn't contain your username or email", passed: noPersonal },
    { id: "strength", label: "Not easy to guess (strength: Strong or better)", passed: strongOk },
  ];
  if (!bytesOk) {
    rules.push({ id: "bytes", label: `At most ${PASSWORD_MAX_BYTES} bytes (shorten it)`, passed: false });
  }

  return {
    ok: rules.every((r) => r.passed),
    score: result.score,
    label: SCORE_LABELS[result.score],
    warning: result.feedback.warning || "",
    suggestions: result.feedback.suggestions || [],
    rules,
  };
};
