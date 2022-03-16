import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/apiCalls";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
`;
const Wrapper = styled.div`
  padding: 25px;
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

const Login = () => {
  const history = useHistory();
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
  };

  useEffect(() => {
    if (currentUser) {
      history.push("/");
    }
  }, [currentUser, history]);

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <Form>
          <Input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="Username"
          />
          <Input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Password"
          />
          <Button
            onClick={(e) => {
              handleLogin(e);
            }}
          >
            Login
          </Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
