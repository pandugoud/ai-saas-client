import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSessionsApi, getSessionByIdApi } from "../api/chat";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessionsApi();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoading(false);
    }
  };

  const openSession = async (id) => {
    try {
      const data = await getSessionByIdApi(id);
      setActiveSession(data.session);
    } catch (error) {
      console.error("Failed to load session", error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="dashboard-layout">
        <aside className="session-list">
          <div className="section-head">
            <h2>Chat History</h2>
            <button className="nav-btn" onClick={loadSessions}>Refresh</button>
          </div>

          {loading ? (
            <p>Loading sessions...</p>
          ) : sessions.length ? (
            sessions.map((session) => (
              <button
                key={session._id}
                className="session-item"
                onClick={() => openSession(session._id)}
              >
                <strong>{session.title}</strong>
                <span>{session.botId}</span>
              </button>
            ))
          ) : (
            <p>No chat history found.</p>
          )}
        </aside>

        <section className="session-view">
          <h2>Session Details</h2>

          {!activeSession ? (
            <p>Select a session from the left.</p>
          ) : (
            <div className="session-messages">
              {activeSession.messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.role}`}>
                  <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}