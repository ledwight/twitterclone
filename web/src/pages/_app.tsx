import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import { createClient, Provider } from 'urql'
import theme from '../theme'
import { createUrqlClient } from '../utils/createUrqlClient'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { PostsQuery } from '../generated/graphql'

function MyApp({ Component, pageProps }: any) {
  return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
  )
}

export default MyApp
