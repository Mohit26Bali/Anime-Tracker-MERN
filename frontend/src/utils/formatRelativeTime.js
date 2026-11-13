const UNITS = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
];

const formatRelativeTime = (isoString) => {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return "just now";

  for (const unit of UNITS) {
    const value = Math.floor(seconds / unit.seconds);
    if (value >= 1) return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
  }

  return "just now";
};

export default formatRelativeTime;
