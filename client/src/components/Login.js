import gql from "graphql-tag";
import React from "react";
import { Mutation } from "react-apollo";
import { AUTH_TOKEN } from "../constants";
import { useUser } from "../context/user-context";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

function Login(props) {
  const [_, setUser] = useUser();
  const [state, setState] = React.useState({
    login: true, // switch between Login and SignUp
    email: "",
    password: "",
    name: "",
  });

  const confirm = async (data) => {
    const { token } = state.login ? data.login : data.signup;
    saveUserData(token);
    console.log(state);
    setUser({ type: "SET_NAME", payload: state.email });
    props.history.push(`/`);
  };

  const saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    event.persist();

    setState({
      ...state,
      [name]: value,
    });
  };

  const { login, email, password, name } = state;
  return (
    <div>
      <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            name="name"
            value={name}
            onChange={handleChange}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          name="email"
          value={email}
          onChange={handleChange}
          type="text"
          placeholder="Your email address"
        />
        <input
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={(data) => confirm(data)}
        >
          {(mutation) => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login ? "login" : "create account"}
            </div>
          )}
        </Mutation>
        <div
          className="pointer button"
          onClick={() => setState({ login: !login })}
        >
          {login ? "need to create an account?" : "already have an account?"}
        </div>
      </div>
    </div>
  );
}

export default Login;
