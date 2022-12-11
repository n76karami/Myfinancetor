import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import CustomApolloProvider from './apollo_client';

// const client = new ApolloClient({
//   uri: 'http://localhost:80/graphql',
//   cache: new InMemoryCache(),
// });

const sleep = ms => new Promise(res => setTimeout(() => res(), ms))
window.sleep = sleep

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <ApolloProvider client={client}>
  <CustomApolloProvider>
    <App />
  </CustomApolloProvider>
  // </ApolloProvider>
);


