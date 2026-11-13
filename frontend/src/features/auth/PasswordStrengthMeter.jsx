const SEGMENT_COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
const LABEL_COLORS = ["text-red-400", "text-orange-400", "text-yellow-400", "text-lime-400", "text-green-400"];

function PasswordStrengthMeter({ strength, hasPassword }) {
  if (!hasPassword) {
    return <p className="mt-1 text-xs text-stone-600">Use 8+ characters. A passphrase of several random words works well.</p>;
  }

  if (!strength) {
    return <p className="mt-1 text-xs text-stone-500">Checking strength…</p>;
  }

  const { score, label, rules, warning, suggestions } = strength;

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" role="img" aria-label={`Password strength: ${label}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? SEGMENT_COLORS[score] : "bg-stone-700"}`}
            />
          ))}
        </div>
        <span className={`w-20 text-right text-xs font-medium ${LABEL_COLORS[score]}`}>{label}</span>
      </div>

      <ul className="mt-2 space-y-0.5">
        {rules.map((rule) => (
          <li key={rule.id} className={`flex items-center gap-1.5 text-xs ${rule.passed ? "text-green-400" : "text-stone-500"}`}>
            <span aria-hidden="true">{rule.passed ? "✓" : "○"}</span>
            <span>
              {rule.label}
              <span className="sr-only">{rule.passed ? " (met)" : " (not met)"}</span>
            </span>
          </li>
        ))}
      </ul>

      {!strength.ok && (warning || suggestions.length > 0) && (
        <p className="mt-1.5 text-xs text-stone-400">
          {warning && <span>{warning} </span>}
          {suggestions[0] && <span>{suggestions[0]}</span>}
        </p>
      )}
    </div>
  );
}

export default PasswordStrengthMeter;
