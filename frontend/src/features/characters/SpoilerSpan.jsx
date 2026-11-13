import { useState } from "react";

function SpoilerSpan({ content }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onClick={() => setRevealed(true)}
      className={
        revealed
          ? "rounded bg-stone-800 px-1"
          : "cursor-pointer rounded bg-stone-700 px-1 text-transparent select-none"
      }
      title={revealed ? undefined : "Click to reveal spoiler"}
    >
      {content}
    </span>
  );
}

export default SpoilerSpan;
