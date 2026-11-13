import { ANIME_FIELDS_FRAGMENT } from "../fragments.js";

const animeDetailsQuery = `
  ${ANIME_FIELDS_FRAGMENT}
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      ...AnimeFields
      description(asHtml: false)
      status
      genres
      format
      duration
      season
      seasonYear
      source
      popularity
      favourites
      studios(isMain: true) {
        nodes {
          id
          name
        }
      }
      tags {
        name
        rank
        isMediaSpoiler
      }
      rankings {
        rank
        type
        context
        allTime
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              romaji
              english
            }
            format
            type
            coverImage {
              extraLarge
            }
          }
        }
      }
      mainCharacters: characters(role: MAIN, sort: ROLE, page: 1, perPage: 8) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      supportingCharacters: characters(role: SUPPORTING, sort: ROLE, page: 1, perPage: 8) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
    }
  }
`;

export default animeDetailsQuery;
