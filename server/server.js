const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
dotEnv.config();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected via Mongoose"))
  .catch((err) => console.log("Connection Error:", err));

// Schema
const pasteSchema = new mongoose.Schema({
  customId: { type: String, default: uuidv4, unique: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: null },
  max_views: { type: Number, default: null },
  view_count: { type: Number, default: 0 },
});

const Paste = mongoose.model("Paste", pasteSchema);

// Insert Data
app.post("/api/pastes", async (req, res) => {
  try {
    const { content, expirationMinutes, maxViews } = req.body;

    // Logic to calculate expiry
    let expires_at = null;
    if (expirationMinutes) {
      expires_at = new Date(Date.now() + parseInt(expirationMinutes) * 60000);
    }

    const newPaste = new Paste({
      content,
      customId: uuidv4(),
      expires_at: expires_at,
      max_views: maxViews ? parseInt(maxViews) : null,
    });

    await newPaste.save();
    res.status(201).json({ id: newPaste.customId });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Failed to save paste" });
  }
});

// get data
app.get("/api/pastes/:id", async (req, res) => {
  try {
    //  Use findOne with customId because that's what we sent to the URL
    const paste = await Paste.findOne({ customId: req.params.id });

    if (!paste) {
      return res.status(404).json({ error: "Paste not found in database" });
    }

    // CHECK TIME EXPIRATION
    if (paste.expires_at && new Date() > paste.expires_at) {
      return res
        .status(410)
        .json({ error: "This paste has expired (Time limit reached)" });
    }

    // CHECK VIEW LIMIT
    if (paste.max_views && paste.view_count >= paste.max_views) {
      return res
        .status(410)
        .json({ error: "This paste has expired (View limit reached)" });
    }

    //INCREMENT VIEW COUNT
    paste.view_count += 1;
    await paste.save();

    res.json(paste);
  } catch (error) {
    res.status(500).json({ error: "Server error during fetch" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
