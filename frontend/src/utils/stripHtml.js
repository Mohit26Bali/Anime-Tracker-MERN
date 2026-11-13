const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

const stripHtml = (html) => {
  if (!html) return "";

  let text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");

  Object.entries(ENTITY_MAP).forEach(([entity, char]) => {
    text = text.replaceAll(entity, char);
  });

  return text;
};

export default stripHtml;
