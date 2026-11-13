const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month <= 1 || month === 11) return { season: "WINTER", seasonYear: month === 11 ? year + 1 : year };
  if (month <= 4) return { season: "SPRING", seasonYear: year };
  if (month <= 7) return { season: "SUMMER", seasonYear: year };
  return { season: "FALL", seasonYear: year };
};

export default getCurrentSeason;
