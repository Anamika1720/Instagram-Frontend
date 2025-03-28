import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import FileUploadModal from "./FileUpload";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 13, 51, 0.6);
  padding: 1rem 2rem;
  color: black;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.3s;
`;

const Button = styled.button`
  background: #1877f2;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
`;

const UploadButton = styled.button`
  background: #1877f2;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
`;

const Navbar = ({ user, logout }) => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <>
      <Nav>
        <StyledLink to="/">Home</StyledLink>
        <NavLinks>
          {user ? (
            <>
              <StyledLink to="/posts">Posts</StyledLink>
              <UploadButton onClick={() => setUploadModalOpen(true)}>
                Upload
              </UploadButton>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <StyledLink to="/login">Login</StyledLink>
              <StyledLink to="/register">Register</StyledLink>
            </>
          )}
        </NavLinks>
      </Nav>
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
