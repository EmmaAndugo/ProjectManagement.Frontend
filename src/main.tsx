import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider } from '@apollo/client/react'
import apolloClient from './api/graphql/apolloClient'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </QueryClientProvider>
  </StrictMode>,
)