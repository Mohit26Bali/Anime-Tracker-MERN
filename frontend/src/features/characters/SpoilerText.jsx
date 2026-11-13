import parseSpoilerSegments from "../../utils/parseSpoilerSegments";
import SpoilerSpan from "./SpoilerSpan";

function SpoilerText({ text }) {
  if (!text) return null;

  const segments = parseSpoilerSegments(text);

  return (
    <p className="whitespace-pre-line text-sm text-stone-300">
      {segments.map((segment, index) =>
        segment.type === "spoiler" ? (
          <SpoilerSpan key={index} content={segment.content} />
        ) : (
          <span key={index}>{segment.content}</span>
        )
      )}
    </p>
  );
}

export default SpoilerText;
