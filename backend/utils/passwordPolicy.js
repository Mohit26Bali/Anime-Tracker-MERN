// The @zxcvbn-ts packages are CommonJS, so they are imported via their default export.
import zxcvbnCore from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";

const zxcvbn = new zxcvbnCore.ZxcvbnFactory({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

export const PASSWORD_MIN_LENGTH = 8;
// bcrypt only uses the first 72 BYTES of the input, so anything longer is rejected, not silently truncated.
export const PASSWORD_MAX_BYTES = 72;
// zxcvbn score: 0 very weak, 1 weak, 2 fair, 3 strong, 4 very strong.
export const PASSWORD_MIN_SCORE = 3;

const SCORE_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

// Pieces of the user's own data that must not appear inside the password.
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
 * Checks a new password against the policy.
 * @returns {{ ok: boolean, errors: string[], score: number, label: string, warning: string, suggestions: string[] }}
 */
export const checkPassword = (password, { username, email } = {}) => {
  const errors = [];

  if (typeof password !== "string") {
    return { ok: false, errors: ["Password must be a string"], score: 0, label: SCORE_LABELS[0], warning: "", suggestions: [] };
  }

  if ([...password].length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
    errors.push(`Password is too long (maximum ${PASSWORD_MAX_BYTES} bytes; non-English characters count as several)`);
  }
  if (password.trim().length === 0) {
    errors.push("Password cannot be only whitespace");
  }

  const lowered = password.toLowerCase();
  const tokens = personalTokens({ username, email });
  if (tokens.some((t) => lowered.includes(t.toLowerCase()))) {
    errors.push("Password must not contain your username or email");
  }

  // zxcvbn is slow on very long input; the byte check above already bounds the work for valid input.
  const result = zxcvbn.check(password.slice(0, 100), tokens);
  const score = result.score;
  if (score < PASSWORD_MIN_SCORE && errors.length === 0) {
    errors.push(
      result.feedback.warning
        ? `Password is too weak: ${result.feedback.warning.replace(/\.$/, "")}`
        : "Password is too weak. Use a longer password or a passphrase of several random words"
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    score,
    label: SCORE_LABELS[score],
    warning: result.feedback.warning || "",
    suggestions: result.feedback.suggestions || [],
  };
};
