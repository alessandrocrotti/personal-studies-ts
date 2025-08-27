import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { CreateUserInput, Profile, Role, User } from "./types";

/**
 * GraphQL schema definition
 * Contiene tutta la definizione dei tipi, query e mutation utilizzati nel server
 */
const typeDefs = `#graphql
  # Tipi scalari ed oggetti
  # Il simbolo "!" indica che il campo è obbligatorio in input, ma se non richiesto in output non verrà restituito
  type User {
    id: ID!
    name: String!
    age: Int
    role: Role!
    profile: Profile
    posts: [Post!]!
  }

  type Profile {
    bio: String
    avatarUrl: String
    location: String
  }

  type Post {
    id: ID!
    title: String!
    content: String
  }

  # Enumerazione
  enum Role {
    ADMIN
    USER
    GUEST
  }

  # Input per mutation
  input CreateUserInput {
    name: String!
    age: Int
    role: Role!
  }

  # Query disponibili
  type Query {
    hello: String
    greet(name: String!): String
    getUser(id: ID!): User
  }

  # Mutation disponibili
  type Mutation {
    sum(a: Int!, b: Int!): Int
    createUser(input: CreateUserInput!): User
  }
`;

// Esempio di dati iniziali
// Questi dati sono utilizzati per simulare un database in memoria
const users: User[] = [
  {
    id: "1",
    name: "Alessandro",
    age: 35,
    role: Role.ADMIN,
    // Commentato il profile per mostrare come si può risolvere in modo separato
    // profile: {
    //   bio: "Senior dev & GraphQL explorer",
    //   avatarUrl: "https://i.imgur.com/avatar.png",
    //   location: "Novellara",
    // },
    posts: [
      { id: "p1", title: "GraphQL Rocks", content: "..." },
      { id: "p2", title: "Typed APIs FTW", content: "..." },
    ],
  },
];

const userProfiles: Profile[] = [{ userId: "1", bio: "Senior dev & GraphQL explorer!!!", avatarUrl: "https://i.imgur.com/avatar.png", location: "Novellara" }];
/**
 * GraphQL resolvers
 * Associano le query e mutation definite nello schema con la logica di business
 */
const resolvers = {
  Query: {
    hello: () => "Hello from Apollo GraphQL server!",
    greet: (_parent: any, args: { name: any }) => `Ciao, ${args.name}!`,
    getUser: (_parent: any, args: { id: string }) => users.find((u) => u.id === args.id) || null,
  },
  // Se vuoi resolver separati per campi annidati di un certo tipo, puoi definirli qui
  // In questo caso, il resolver per "profile" e "posts" di un User.
  // Profile è in una variabile separata, quindi è necessario un resolver specifico (commentata la parte in cui il profile è già incluso nell'oggetto User). Senza questo resolver, profile sarebbe null
  // Posts sono già inclusi nell'oggetto User, quindi non sarebbe necessario un resolver specifico. Senza questo resolver GraphQL riesce comunque a recuperarlo e valorizzarlo correttamente
  User: {
    // profile: (parent: any) => parent.profile,
    profile: (parent: User) => userProfiles.find((p) => p.userId === parent.id) || null,
    posts: (parent: User) => parent.posts,
  },
  Mutation: {
    sum: (_parent: any, args: { a: number; b: number }) => args.a + args.b,
    createUser: (_parent: any, args: { input: CreateUserInput }) => {
      const newUser: User = {
        id: String(users.length + 1),
        ...args.input,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

export async function startGraphQLServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀 Server ready at ${url}`);
}
