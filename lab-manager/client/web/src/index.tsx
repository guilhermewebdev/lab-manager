import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { verifyAuth, getToken, getStorage } from './services/auth'
import { persistCache } from 'apollo-cache-persist';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const cache = new InMemoryCache()

persistCache({
  cache,
  storage: getStorage(),
  key: 'andrack',
  debug: true,
})

const client = new ApolloClient({
  uri: 'http://localhost/api/',
  cache,
  request: (operation) => {
    const token = getToken();
    operation.setContext({
      headers: {
        authorization: !!token && `JWT ${token}`
      }
    })
  },
  typeDefs: gql`
    extend type Query {
      isAuthenticated: Boolean!
      laboratory: Int
      themeDark: Boolean
    }
  `,
  resolvers: {}
});


verifyAuth(client)

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <App />
        </MuiPickersUtilsProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
