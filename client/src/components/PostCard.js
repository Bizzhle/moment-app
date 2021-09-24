import React, { useContext } from "react";
import { Button, Card, Icon, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = ({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="ui card fluid ">
      <Card.Content as={Link} to={`/posts/${id}`}>
        <div className="flex justify-between mb-2">
          <Card.Header className="font-semibold text-black">
            {username}
          </Card.Header>
          <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        </div>

        <Card.Description>{body}</Card.Description>
      </Card.Content>

      <div className="ui py-2 px-4 border-t-2 flex justify-between">
        <div className="">
          <span className="mr-8">
            <LikeButton user={user} post={{ id, likes, likeCount }} />
          </span>

          <Popup
            disabled
            style={{ margin: 0 }}
            trigger={
              <Button
                labelPosition="right"
                as={Link}
                to={user ? `/posts/${id}` : "/login"}
              >
                <button className="mr-2">
                  <Icon name="comment outline" />
                </button>
                <div className="" color="blue" pointing="left">
                  {commentCount}
                </div>
              </Button>
            }
          />
        </div>

        {user && user.username === username && <DeleteButton postId={id} />}
      </div>
    </div>
  );
};

export default PostCard;
