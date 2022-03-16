import { useState } from "react";
import styled from "styled-components";
import { login } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  padding: 20px;
  width: 25%;
  background-color: white;
`;
const Title = styled.h1`
  font-size: 30px;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 10px 15px;
  color: white;
  background-color: teal;
  cursor: pointer;
  margin: 20px 0;
  text-align: center;
  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
`;
const Link = styled.a`
  margin: 5px 0;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

const Error = styled.span`
  color: red;
  margin-bottom: 10px;
`;

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, isFetching, error } = useSelector((state) => state.user);

  const handleLogin = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
    currentUser && history.push("/home");
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            type={"password"}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            onClick={(e) => {
              handleLogin(e);
            }}
            disabled={isFetching}
          >
            LOGIN
          </Button>

          {error && <Error>Something went wrong.</Error>}
          <Link>YOU FORGOT YOUR PASSWORD ?</Link>
          <Link>DON'T HAVE AN ACCOUNT ? CREATE ONE.</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
