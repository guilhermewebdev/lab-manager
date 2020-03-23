import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Vue from 'vue'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost/api/',
})

const publicLink = createHttpLink({
    uri: 'http://localhost/api/public/'
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const publicClient = new ApolloClient({
    link: publicLink,
    cache,
})

export default new VueApollo({
    defaultClient: apolloClient,
    clients: {
        a: apolloClient,
        b: publicClient,
    }
})