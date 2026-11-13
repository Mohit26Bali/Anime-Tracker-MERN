const SPOILER_PATTERN = /~!([\s\S]*?)!~/g;

const parseSpoilerSegments = (text) => {
  if (!text) return [];

  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = SPOILER_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "spoiler", content: match[1] });
    lastIndex = SPOILER_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments;
};

export default parseSpoilerSegments;
