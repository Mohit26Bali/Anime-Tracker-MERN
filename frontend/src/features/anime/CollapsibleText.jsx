import { useState } from "react";

const CHAR_LIMIT = 250;

function CollapsibleText({ text }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;
  if (text.length <= CHAR_LIMIT) {
    return <p className="whitespace-pre-line text-sm text-stone-300">{text}</p>;
  }

  return (
    <p className="whitespace-pre-line text-sm text-stone-300">
      {expanded ? text : `${text.slice(0, CHAR_LIMIT).trimEnd()}…`}{" "}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="font-semibold text-orange-400 hover:underline"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </p>
  );
}

export default CollapsibleText;
