import React from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

const ChatPage = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Chat Page</h1>
      <p>Welcome {user?.name || "User"}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ChatPage;
