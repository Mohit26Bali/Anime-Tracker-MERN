const characterDetailsQuery = `
  query ($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
        alternative
      }
      image {
        large
      }
      description(asHtml: false)
      gender
      age
      bloodType
      favourites
      media(sort: POPULARITY_DESC, page: 1, perPage: 12) {
        nodes {
          id
          type
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
          }
        }
      }
    }
  }
`;

export default characterDetailsQuery;
