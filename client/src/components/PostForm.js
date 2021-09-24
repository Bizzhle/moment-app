import React from "react";
import { Form, Button } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      const new_post = result.data.createPost;
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [new_post, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(err) {
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <div className=" pt-20">
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input
            placeholder="Hi Family"
            name="body"
            onChange={onChange}
            value={capitalize(values.body)}
            error={error ? true : false}
          />
          <Button type="submit" color="teal" disabled={values.body === ""}>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
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

export default PostForm;
