import { ANIME_FIELDS_FRAGMENT } from "../fragments.js";

const trendingAnimeQuery = `
  ${ANIME_FIELDS_FRAGMENT}
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(type: ANIME, sort: TRENDING_DESC) {
        ...AnimeFields
      }
    }
  }
`;

export default trendingAnimeQuery;
