import { ANIME_FIELDS_FRAGMENT } from "../fragments.js";

const searchAnimeQuery = `
  ${ANIME_FIELDS_FRAGMENT}
  query (
    $search: String
    $page: Int
    $perPage: Int
    $genre: String
    $tag: String
    $format: MediaFormat
    $status: MediaStatus
    $sort: [MediaSort]
    $season: MediaSeason
    $seasonYear: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        search: $search
        type: ANIME
        genre: $genre
        tag: $tag
        format: $format
        status: $status
        sort: $sort
        season: $season
        seasonYear: $seasonYear
      ) {
        ...AnimeFields
      }
    }
  }
`;

export default searchAnimeQuery;
