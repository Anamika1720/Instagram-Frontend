import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin: 0.5rem;
  padding: 10px 20px;
  background: #444;
  color: white;
  text-decoration: none;
  font-size: 16px;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #222;
  }
`;

const Home = () => (
  <Container>
    <Logo
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8lv-iEOWtRxGDqsOR-Pa1kIiqN298569zVA&s"
      alt="Instagram Logo"
    />
    <Title>Welcome to Instagram</Title>
    <StyledLink to="/register">Register</StyledLink>
    <StyledLink to="/login">Login</StyledLink>
  </Container>
);

export default Home;
