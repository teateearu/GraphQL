import { makeExecutableSchema } from 'graphql-tools';
import http from 'request-promise-json';

const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

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

// example data
const movies = [
  { title: 'Indiana Jones and the Temple of Doom', budget: 28000000, id: 87,
  imdb_id: 'tt0087469', release_date: '1984-05-23'},
];
const posts = [
  { id: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, title: 'Launchpad is Cool', votes: 7 },
];

const typeDefs = `
  type Movie {
    title: String!
    budget: Int
    id: ID!
    imdb_id: String
    release_date: String
  }

  type Post {
    id: Int!
    title: String
    votes: Int
  }

  type Query {
    posts: [Post]
    movies: [Movie]
    movie(id: ID, imdb_id: String): Movie
  }

  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

// const resolvers = {
//   Query: {
//     posts: () => posts,
//     movies: () => movies,
//   },
//   Mutation: {
//     upvotePost: (_, { postId }) => {
//       const post = find(posts, { id: postId });
//       if (!post) {
//         throw new Error(`Couldn't find post with id ${postId}`);
//       }
//       post.votes += 1;
//       return post;
//     },
//   },
// };

const resolvers = {
  Query: {
    movie: async (obj, args, context, info) => {
      if (args.id) {
        return http
          .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
      }
      if (args.imdb_id) {
        const results = await http
          .get(`https://api.themoviedb.org/3/find/${args.imdb_id}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`)

        if (results.movie_results.length > 0) {
          const movieId = results.movie_results[0].id
          return http
            .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
        }
      }
    },
    movies: () => movies,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
