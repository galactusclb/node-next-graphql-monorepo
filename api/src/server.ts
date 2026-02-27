import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

type User = {
  id: string;
  name: string;
  age: number;
  isMarried: boolean;
};

type GetUserByIdArgs = Pick<User, "id">;
type CreateUserArgs = Omit<User, "id">;

const users: User[] = [
  {
    id: "1",
    name: "Kate Chopin",
    age: 12,
    isMarried: false,
  },
  {
    id: "2",
    age: 32,
    name: "Paul Auster",
    isMarried: true,
  },
];

const typeDefs = `#graphql
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, age: Int!, isMarried: Boolean!): User
  }

  type User {
    id: ID
    name: String
    age: Int
    isMarried: Boolean
  }
`;

const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (parent: unknown, args: GetUserByIdArgs) => {
      const { id } = args;
      return users.find((item) => item.id === id);
    },
  },

  Mutation: {
    createUser: (parent: unknown, args: CreateUserArgs) => {
      const { name, age, isMarried } = args;
      return users.push({ name, age, isMarried, id: `${users?.length + 1}` });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`Server is running on ${url}`);
