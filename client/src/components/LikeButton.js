import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import { Button, Icon } from "semantic-ui-react";

// import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <button className="text-red-500 mr-2">
        <Icon name="heart" />
      </button>
    ) : (
      <button className="text-blue-500 mr-2">
        <Icon name="heart outline" />
      </button>
    )
  ) : (
    <button className="text-blue-500 mr-2" as={Link} to="/login">
      <Icon name="heart outline" />
    </button>
  );

  return user ? (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}
      {/* <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup> */}
      <div>{likeCount}</div>
    </Button>
  ) : (
    <Button as="div" labelPosition="right">
      {likeButton}
      {/* <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup> */}
      <div>{likeCount}</div>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id

      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
