export const ANIME_FIELDS_FRAGMENT = `
  fragment AnimeFields on Media {
    id
    title {
      romaji
      english
    }
    coverImage {
      extraLarge
    }
    bannerImage
    episodes
    averageScore
  }
`;
