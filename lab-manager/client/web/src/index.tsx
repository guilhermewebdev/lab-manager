import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'http://localhost/api/',
  cache: new InMemoryCache(),
  request: (operation) => {
    const token = sessionStorage.getItem('bat') || localStorage.getItem('bat');
    operation.setContext({
      headers: {
        authorization: token ? `JWT ${token}` : ''
      }
    })
  },
  typeDefs: gql`
    extend type Query {
      isAuthenticated: Boolean!
    }
  `,
  resolvers: {}
});

client.query({
  query: gql`
    query {
      isAuthenticated
    }
  `
}).then(data => {
  client.writeData({ data: { isAuthenticated: data.data.isAuthenticated } })
})

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
