import React from "react";

export default function SearchModeToggle({ mode, setMode }) {
  return (
    <div className="toggle-wrap">
      <button
        className={mode === "docs" ? "toggle-btn active" : "toggle-btn"}
        onClick={() => setMode("docs")}
      >
        Docs Chat
      </button>
      <button
        className={mode === "web" ? "toggle-btn active" : "toggle-btn"}
        onClick={() => setMode("web")}
      >
        Web Search
      </button>
    </div>
  );
}