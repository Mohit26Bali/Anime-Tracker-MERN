export const mapCharacter = (edge) => ({
  id: edge.node.id,
  name: edge.node.name.full,
  image: edge.node.image.large,
  role: edge.role,
  voiceActor: edge.voiceActors[0]
    ? {
        id: edge.voiceActors[0].id,
        name: edge.voiceActors[0].name.full,
        image: edge.voiceActors[0].image.large,
      }
    : null,
});

export const mapCharacterList = (edges) => edges.map(mapCharacter);

export const mapCharacterSearchResult = (node) => ({
  id: node.id,
  name: node.name.full,
  image: node.image.large,
});

export const mapCharacterSearchList = (nodes) => nodes.map(mapCharacterSearchResult);

export const mapCharacterDetails = (character) => ({
  id: character.id,
  name: character.name.full,
  nativeName: character.name.native,
  alternativeNames: character.name.alternative.filter(Boolean),
  image: character.image.large,
  description: character.description,
  gender: character.gender,
  age: character.age,
  bloodType: character.bloodType,
  favourites: character.favourites,
  appearances: character.media.nodes.map((node) => ({
    id: node.id,
    title: node.title.english || node.title.romaji,
    coverImage: node.coverImage.extraLarge,
    isAnime: node.type === "ANIME",
  })),
});
