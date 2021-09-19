const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const mongoose = require("mongoose");

// const pubsub = new PubSub();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await server.start();

  server.applyMiddleware({ app });

  app.use(cors());
  app.use((req, res) => {
    res.send("hello from express apollo");
  });

  await mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("MongoDB connected...");
    });

  app.listen({ port: 4000 }, () =>
    console.log("Now browse to http://localhost:4000" + server.graphqlPath)
  );
}

startServer();

//8L2xVpdxPZJ3
//mongodb+srv://famBook:8L2xVpdxPZJ3@cluster0.hiqwq.mongodb.net/fam_book?retryWrites=true&w=majority
