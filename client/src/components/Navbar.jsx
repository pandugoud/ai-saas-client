import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/chat" className="brand">GPT</Link>

      <div className="nav-actions">
        <span className="user-badge">{user?.name || "User"}</span>
        <Link to="/dashboard" className="nav-btn">Dashboard</Link>
        <button className="nav-btn danger" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}