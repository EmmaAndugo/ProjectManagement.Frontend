import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://localhost:7175/graphql',
  }),
  cache: new InMemoryCache(),
})

export default apolloClient