import { mapCharacterList } from "./characterMapper.js";

const TAG_LIMIT = 8;

export const mapAnime = (media) => ({
  id: media.id,
  title: media.title.english || media.title.romaji,
  coverImage: media.coverImage.extraLarge,
  bannerImage: media.bannerImage,
  episodes: media.episodes,
  score: media.averageScore,
});

export const mapAnimeList = (mediaList) => mediaList.map(mapAnime);

export const mapRecommendationList = (nodes) =>
  nodes
    .filter((node) => node.mediaRecommendation)
    .map((node) => ({
      rating: node.rating,
      anime: mapAnime(node.mediaRecommendation),
    }));

const mapTags = (tags) =>
  tags
    .filter((tag) => !tag.isMediaSpoiler)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, TAG_LIMIT)
    .map((tag) => tag.name);

const mapRankings = (rankings) => ({
  allTimeRated: rankings.find((r) => r.type === "RATED" && r.allTime)?.rank ?? null,
  seasonPopular: rankings.find((r) => r.type === "POPULAR" && !r.allTime)?.rank ?? null,
});

const mapRelations = (edges) =>
  edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title.english || edge.node.title.romaji,
    format: edge.node.format,
    isAnime: edge.node.type === "ANIME",
    coverImage: edge.node.coverImage.extraLarge,
    relationType: edge.relationType,
  }));

export const mapAnimeDetails = (media) => ({
  ...mapAnime(media),
  description: media.description,
  status: media.status,
  genres: media.genres,
  format: media.format,
  duration: media.duration,
  season: media.season,
  seasonYear: media.seasonYear,
  source: media.source,
  popularity: media.popularity,
  favourites: media.favourites,
  studio: media.studios.nodes[0]?.name ?? null,
  tags: mapTags(media.tags),
  rankings: mapRankings(media.rankings),
  relations: mapRelations(media.relations.edges),
  characters: {
    main: mapCharacterList(media.mainCharacters.edges),
    supporting: mapCharacterList(media.supportingCharacters.edges),
  },
});
