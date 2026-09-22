import { useQuery } from '@apollo/client/react'
import { GET_USERS } from '../graphql/userQueries'

export const useUsersGraphQL = () => {
  return useQuery(GET_USERS)
}