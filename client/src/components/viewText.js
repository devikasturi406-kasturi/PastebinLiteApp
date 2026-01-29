import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewText = () => {
  const { id } = useParams();
  const [text, setText] = useState(null);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    axios
      .get(`https://pastebinliteapp.onrender.com/api/pastes/${id}`)
      .then((res) => {
        setText(res.data);
        if (res.data.expires_at) {
          startCountdown(res.data.expires_at);
        }
      })

      .catch((err) => {
        if (err.response && err.response.status === 410) {
          setError(err.response.data.error);
        } else {
          setError("Paste not found or server error.");
        }
      });
  }, [id]);
  const startCountdown = (expiryDate) => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiryDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
        setText(null);
        setError("This Paste has self-destructed.");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  if (error)
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
  if (!text) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h3>Shared Text</h3>
      {timeLeft && (
        <div
          style={{
            color: "red",
            fontWeight: "bold",
            border: "1px solid red",
            padding: "5px 10px",
          }}
        >
          Expires in: {timeLeft}
        </div>
      )}
      <pre
        style={{
          background: "#f4f4f4",
          padding: "15px",
          border: "1px solid #ddd",
        }}
      >
        {text.content}
      </pre>
      <p>
        <small>Views recorded: {text.view_count}</small>
      </p>
    </div>
  );
};

export default ViewText;
