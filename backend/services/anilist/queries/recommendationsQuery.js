import { ANIME_FIELDS_FRAGMENT } from "../fragments.js";

const recommendationsQuery = `
  ${ANIME_FIELDS_FRAGMENT}
  query ($id: Int, $page: Int, $perPage: Int) {
    Media(id: $id, type: ANIME) {
      recommendations(sort: RATING_DESC, page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        nodes {
          rating
          mediaRecommendation {
            ...AnimeFields
          }
        }
      }
    }
  }
`;

export default recommendationsQuery;
