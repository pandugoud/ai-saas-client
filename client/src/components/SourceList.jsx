import React from "react";

export default function SourceList({ sources = [] }) {
  if (!sources.length) return null;

  return (
    <div className="sources-box">
      <h3>Sources</h3>
      <ul className="sources-list">
        {sources.map((src, index) => (
          <li key={index} className="source-item">
            <a href={src.url} target="_blank" rel="noreferrer">
              {src.title || src.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}