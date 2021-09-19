import React, { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";

import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [isOpen, setIsOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POSTS_QUERY;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setIsOpen(false);

      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const newPosts = data.getPosts.filter((p) => p.id !== postId);

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: [...newPosts] },
        });
      }

      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <Popup
        content="delete"
        basic
        style={{ margin: 0 }}
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setIsOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
};

const DELETE_POSTS_QUERY = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
