import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
import store from '@/store/index';

Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

const getToken = (tokenName = AUTH_TOKEN) => (
    sessionStorage.getItem(tokenName) || 
    localStorage.getItem(tokenName)
)

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost/api/'
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/api/'))

Vue.prototype.$filesRoot = filesRoot

// Cache implementation
const cache = new InMemoryCache()

// Config
const defaultOptions = {
    // You can use `https` for secure connection (recommended in production)
    httpEndpoint,
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost/api/',
    // LocalStorage token
    tokenName: AUTH_TOKEN,
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false,
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false,
    // Is being rendered on the server?
    ssr: false,
  
    // Override default apollo link
    // note: don't override httpLink here, specify httpLink options in the
    // httpLinkOptions property of defaultOptions.
    // link: myLink
  
    // Override default cache
    cache,
  
    // Override the way the Authorization header is set
    getAuth(tokenName: string){
        const token = getToken(tokenName)
        return token? `JWT ${token}` : null
    }
  
    // Additional ApolloClient options
    // apollo: { ... }
  
    // Client local data (see apollo-link-state)
    // clientState: { resolvers: { ... }, defaults: { ... } }
}

export async function toggleAuth(apolloClient: any, status: boolean, action?: string){
    if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
    try {
        store.commit('setAuth', status)
        await apolloClient.resetStore()
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`%cError on cache reset (${action})', 'color: orange;`, e.message)
    }
}

export async function refreshAuth(client: ApolloClient<any>): Promise<any>{
    const keepToken: string|null = localStorage.getItem(AUTH_TOKEN)
    const token: string|null = getToken()
    const keep: boolean = keepToken === token
    return client.mutate({
        mutation: require('@/graphql/remote/RefreshToken.gql'),
        variables: {
            token
        }
    })
        .then(response => {
            const token = response.data.refreshToken.token
            if (typeof (localStorage && sessionStorage) !== 'undefined' && token) {
                keep? localStorage.setItem(AUTH_TOKEN, token) : sessionStorage.setItem(AUTH_TOKEN, token)
            }
            toggleAuth(client, !!response.data.refreshToken.payload.username, 'refresh')
            return setInterval(() => {                
                return refreshAuth(client)
            }, 1000 * 60 * 4)
        })
        .catch(console.error)
}

export async function verifyAuth(client: ApolloClient<any>){
    const token: string|null = getToken()
    if(token){
        client.mutate({
            mutation: require('@/graphql/remote/VerifyLogin.gql'),
            variables: {
                token
            }
        })
            .then(response => {
                toggleAuth(client, !!response.data.verifyToken.payload.username, 'verify')
            })
    }
}

// Call this in the Vue app file
export function createProvider (options = {}) {
// Create apollo client
    const { apolloClient, wsClient } = createApolloClient({
        ...defaultOptions,
        ...options,
    })
    apolloClient.wsClient = wsClient
    verifyAuth(apolloClient)

    // Create vue apollo provider
    const apolloProvider = new VueApollo({
        defaultClient: apolloClient,
        defaultOptions: {
            $query: {
                // fetchPolicy: 'cache-and-network',
            },
        },
        errorHandler (error) {
            // eslint-disable-next-line no-console
            console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
        },
    })
    return apolloProvider
}

// Manually call this when user log in
export async function onLogin (apolloClient: any, token: string, keep: boolean) {
    if (typeof (localStorage && sessionStorage) !== 'undefined' && token) {
        keep? localStorage.setItem(AUTH_TOKEN, token) : sessionStorage.setItem(AUTH_TOKEN, token)
    }
    await toggleAuth(apolloClient, !!token, 'login')
}

// Manually call this when user log out
export async function onLogout (apolloClient: any) {
    const token = getToken()
    if (typeof localStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_TOKEN)
        localStorage.removeItem(AUTH_TOKEN)
    }
    toggleAuth(apolloClient, false, 'logout')
}

