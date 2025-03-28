import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import PostsPage from "./pages/Posts";
import UploadPost from "./components/FileUpload";

const App = () => {
  const { user, login, logout } = useAuth();

  return (
    <>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route
          path="/posts"
          element={
            user ? <PostsPage user={user} /> : <LoginPage login={login} />
          }
        />
        <Route
          path="/upload"
          element={user ? <UploadPost /> : <LoginPage login={login} />}
        />
      </Routes>
    </>
  );
};

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userWithToken));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return { user, login, logout };
};

export default App;
