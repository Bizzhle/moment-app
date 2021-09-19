import React, { useContext, useState, useRef } from "react";
import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form,
  Popup,
} from "semantic-ui-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "../context/auth";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { data: { getPost } = {} } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      postId,
    },
  });

  const [postComment] = useMutation(COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>loading...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      likes,
      likeCount,
      commentCount,
      comments,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>

              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup
                  content="comment"
                  basic
                  style={{ margin: 0 }}
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("comment on post")}
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="comment..."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment === ""}
                        onClick={postComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>

                  <Card.Description> {comment.body}</Card.Description>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

const COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POSTS_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
