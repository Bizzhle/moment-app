import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MenuBar from "../components/MenuBar";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  return (
    <div>
      <MenuBar />
      <div className="max-w-sm sm:max-w-2xl m-auto pb-4 border-l border-r ">
        {user && (
          <div className="ui column pb-4  px-4">
            <PostForm />
          </div>
        )}
        <hr />
        {loading ? (
          <h1>loading posts...</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <div
                  className=" ui column  px-4 "
                  key={post.id}
                  style={{ marginBottom: 20, marginTop: 20 }}
                >
                  <PostCard post={post} />
                </div>
              ))}
          </Transition.Group>
        )}
      </div>
    </div>
  );
}

export default Home;
