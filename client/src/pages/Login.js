import React, { useState, useContext } from "react";
import { Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/home");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center ">
      <div className="w-80 sm:w-96 m-auto ">
        <Form
          onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : "  "}
        >
          <h2>Login</h2>
          <Form.Input
            // label="Username"
            placeholder="username.."
            name="username"
            type="text"
            value={values.username}
            error={errors.username ? true : false}
            onChange={onChange}
          />

          <Form.Input
            // label="Password"
            placeholder="password.."
            name="password"
            type="password"
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />

          <button
            type="submit"
            className="w-full rounded-md text-white bg-blue-500 p-4"
          >
            Login
          </button>
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className="ui error message w-80 md:w-96">
            <ul className="list">
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
