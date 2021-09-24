import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "apollo-link-context";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";

import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SinglePost from "./pages/SinglePost";
import FrontPage from "./pages/FrontPage";

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      return alert(`Graphql error ${message}`);
    });
  }
});

const httpLink = createHttpLink({
  errorLink,
  uri: "http://localhost:4000/graphql",
  credentials: "same-origin",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),

  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        Part: {
          parts: {
            fields: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    },
  }),
});

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Router>
          <AuthRoute exact path="/" component={FrontPage} />
          <>
            <Route path="/home" component={Home} />
            <AuthRoute path="/login" component={Login} />
            <AuthRoute path="/register" component={Register} />

            <Route path="/posts/:postId" component={SinglePost} />
          </>
        </Router>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
