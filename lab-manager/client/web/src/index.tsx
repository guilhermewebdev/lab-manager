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
import { verifyAuth, getToken } from './services/auth'
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

const client = new ApolloClient({
  uri: 'http://localhost/api/',
  cache: new InMemoryCache(),
  request: (operation) => {
    const token = getToken();
    operation.setContext({
      headers: {
        authorization: `JWT ${token}`
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

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: '#37474f',
      light: '#62727b',
      dark: '#102027',
    },
    secondary: {
      main: '#90a4ae',
      light: '#c1d5e0',
      dark: '#62757f',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
  }
}))

verifyAuth(client)

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
