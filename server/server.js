const express = require('express');
// CRN: import ApolloServer
const {ApolloServer} = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
// CRN: import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const routes = require('./routes');

// CRN: create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req  }),
  introspection: true,
  playground: true,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

// CRN: integrate our Apollo server with the Express application as middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});


startServer();