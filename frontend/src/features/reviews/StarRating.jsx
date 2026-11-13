import { useState } from "react";

function StarRating({ value, onChange, readOnly = false }) {
  const [hoverValue, setHoverValue] = useState(null);
  const displayValue = hoverValue ?? value;

  const stars = Array.from({ length: 10 }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <div className="flex text-orange-400">
        {stars.map((star) => (
          <span key={star} className={star <= value ? "" : "text-stone-700"}>
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex text-2xl text-orange-400"
      onMouseLeave={() => setHoverValue(null)}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHoverValue(star)}
          onClick={() => onChange(star)}
          className={star <= displayValue ? "" : "text-stone-700"}
          aria-label={`Rate ${star} out of 10`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
