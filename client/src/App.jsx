
import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';
//testing code to see if runs better:
// const client = new ApolloClient({
//   uri: 'http://localhost:3001/graphql',
//   cache: new InMemoryCache(),
//   request: (operation) => {
//     const token = localStorage.getItem('token');
//     operation.setContext({
//       headers: {
//         authorization: token ? `Bearer ${token}` : '',
//       },
//     });
//   },
// });

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});   

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// CRN create an Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;