import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Vue from 'vue'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

function getHeaders(){
    const headers = {
    };
    const token = sessionStorage.getItem('FAS_CRI') || localStorage.getItem('FAS_CRI');
    if(token) Object.assign(headers, {
        authorization: `JWT ${token}`
    })
    return headers;
}
// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost/api/',
  headers: getHeaders(),
  
})

const publicLink = createHttpLink({
    uri: 'http://localhost/api/public/',
    headers: getHeaders(),
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache,    
})

const publicCache = new InMemoryCache()
// Create the public client
const publicClient = new ApolloClient({
    link: publicLink,
    cache: publicCache,
})

export default new VueApollo({
    defaultClient: apolloClient,
    clients: {
        a: apolloClient,
        b: publicClient,
    }
})