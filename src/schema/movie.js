import { makeExecutableSchema } from 'graphql-tools';

const filter = (data, conditions) => {
  const fields = Object.keys(conditions);
  return data.filter((obj) => {
    return fields
      .filter(k => obj[k] === conditions[k])
      .length === fields.length;
  });
};

const find = (data, conditions) => {
  return filter(data, conditions)[0];
};

const typeDefs = `
  type Query {
    movies: [Movie]
    movie(id: ID, imdb_id: String): Movie
  }

  type Movie {
    id: ID!
    {
  "backdrop_path": "/mWuFDpOxXJpPxLM3p8f3w02pBb2.jpg",
  "budget": 28000000,
  "genres": [
    {
      "name": "Adventure"
    },
    {
      "name": "Action"
    }
  ],
  "homepage": "http://www.indianajones.com",
  "original_language": "en",
  "original_title": "Indiana Jones and the Temple of Doom",
  "overview": "After arriving in India, Indiana Jones is asked by a desperate village to find a mystical stone. He agrees – and stumbles upon a secret cult plotting a terrible plan in the catacombs of an ancient palace.",
  "popularity": 30.640015,
  "poster_path": "/f2nTRKk2zGdUTE7tLJ5EGGSuKA6.jpg",
  "runtime": 118,
  "status": "Released",
  "tagline": "If adventure has a name... it must be Indiana Jones.",
  "title": "Indiana Jones and the Temple of Doom",
  "vote_average": 7.1,
  "vote_count": 3257
}
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    author: (_, { id }) => find(authors, { id: id }),
  },
  Mutation: {
    upvotePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    },
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
