import React, { useState } from "react";
import axios from "axios";

const CreateText = () => {
  const [content, setContent] = useState("");
  const [minutes, setMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [uniqueLink, setUniqueLink] = useState("");

  const handleSaveText = async () => {
    try {
      const res = await axios.post(
        "https://pastebinliteapp.onrender.com/api/pastes",
        {
          content: content,
          expirationMinutes: minutes,
          maxViews: maxViews,
        },
      );
      const urlId = res.data.id;
      const completeUrl = `https://pastebin-lite-app-two.vercel.app/v/${urlId}`;
      setUniqueLink(completeUrl);
      console.log(res);
    } catch (err) {
      console.error("Error Response:", err.response?.data);
      console.error("Error Status:", err.response?.status);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Create a Secure Text</h1>
      <textarea
        style={{ width: "100%", height: "200px" }}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter text here"
      />
      <div style={{ marginTop: "10px" }}>
        <input
          type="number"
          placeholder="Minutes"
          onChange={(e) => setMinutes(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Views"
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </div>
      <button onClick={handleSaveText} style={{ marginTop: "10px" }}>
        Save Text
      </button>
      {uniqueLink && (
        <div>
          <p>Success! Your text is live at: </p>
          <a href={uniqueLink} target="_blank" rel="noreferrer">
            {uniqueLink}
          </a>
        </div>
      )}
    </div>
  );
};
export default CreateText;
