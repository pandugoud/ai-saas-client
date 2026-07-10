import React, { useState } from "react";
import { uploadDocApi } from "../api/upload";

export default function UploadBox({ botId = "default-bot" }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please choose a file first.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Uploading and training document...");
      const data = await uploadDocApi(file, botId);
      setStatus(data.message || "Document uploaded successfully.");
      setFile(null);
    } catch (error) {
      setStatus(
        error?.response?.data?.message ||
        error?.message ||
        "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="input"
        accept=".pdf,.doc,.docx,.txt"
      />
      <button className="primary-btn" onClick={handleUpload}>
        {loading ? "Uploading..." : "Upload Doc"}
      </button>
      {status && <p className="status">{status}</p>}
    </div>
  );
}