// non usare "@apollo/client" ma "@apollo/client/core" perchè "@apollo/client" richiede le dipendenze di react che in questo progetto non sono necessarie
import { ApolloClient, InMemoryCache, gql, HttpLink, ApolloQueryResult, FetchResult } from "@apollo/client/core";
import fetch from "cross-fetch";
import { CreateUserInput, Role, User } from "./types";

export async function runClient() {
  const client = new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:4000/graphql", fetch }),
    cache: new InMemoryCache(),
  });

  try {
    // Esempio di query semplice dove il tipo "data" è direttamente string e non un oggetto
    const resultGetHello: ApolloQueryResult<string> = await client.query({
      query: gql`
        query GetHello {
          hello
        }
      `,
    });
    console.log("GraphQL response:", resultGetHello.data);

    // Esempio di mutation semplice con variabili dove il tipo "data" è direttamente number e non un oggetto
    const resultGetSum: FetchResult<number> = await client.mutate({
      mutation: gql`
        mutation Sum($a: Int!, $b: Int!) {
          sum(a: $a, b: $b)
        }
      `,
      variables: {
        a: 5,
        b: 7,
      },
    });
    console.log("GraphQL response:", resultGetSum.data);

    // Esempio di mutation con variabili e tipi complessi. Il tipo "data" è un oggetto con una proprietà "createUser" di tipo User
    const resultCreateUser = await client.mutate<{ createUser: User }>({
      mutation: gql`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            name
            role
            age
          }
        }
      `,
      variables: {
        input: {
          name: "Mario",
          age: 30,
          role: Role.USER,
        } satisfies CreateUserInput,
      },
    });
    console.log("Created user:", resultCreateUser.data?.createUser);

    // Esempio di query con variabili e tipi complessi. Il tipo "data" è un oggetto con una proprietà "getUser" di tipo User
    const resultGetUser = await client.query<{ getUser: User }>({
      query: gql`
        query GetUser($id: ID!) {
          getUser(id: $id) {
            id
            name
            age
            role
          }
        }
      `,
      variables: {
        id: "2",
      },
    });
    console.log("User data:", resultGetUser.data.getUser);

    // Esempio di query con variabili e tipi complessi, includendo campi annidati. Il tipo "data" è un oggetto con una proprietà "getUser" di tipo User
    const resultGetUserProfilePost = await client.query<{ getUser: User }>({
      query: gql`
        query GetUserProfilePost($id: ID!) {
          getUser(id: $id) {
            name
            profile {
              bio
              location
            }
            posts {
              title
            }
          }
        }
      `,
      variables: {
        id: "1",
      },
    });

    console.log("User data:", resultGetUserProfilePost.data.getUser);
  } catch (error) {
    console.error("GraphQL error:", error);
  }
}

// Uncomment the following line to run the client directly
// runClient();
