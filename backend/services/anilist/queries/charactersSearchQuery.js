const charactersSearchQuery = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      characters(search: $search, sort: SEARCH_MATCH) {
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
`;

export default charactersSearchQuery;
