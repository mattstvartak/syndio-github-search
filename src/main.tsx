import './index.css';

import * as Apollo from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

const AppWrapper = () => {
  const [client, setClient] =
    React.useState<Apollo.ApolloClient<Apollo.NormalizedCacheObject>>();

  React.useEffect(() => {
    const httpLink = Apollo.createHttpLink({
      uri: 'https://api.github.com/graphql',
    });

    const authLink = setContext((_, { headers }) => {
      const token = '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';

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    async function init() {
      const cache = new Apollo.InMemoryCache();
      const newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        debug: true,
        trigger: 'write',
      });
      await newPersistor.restore();
      setClient(
        new Apollo.ApolloClient({
          link: authLink.concat(httpLink),
          cache,
        }),
      );
    }

    init().catch(console.error);
  }, []);

  return (
    <>
      {!client && <>Initializing...</>}
      {client && (
        <Apollo.ApolloProvider client={client}>
          <App />
        </Apollo.ApolloProvider>
      )}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppWrapper />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
