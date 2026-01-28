const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json()); //This allows the server to read JSON sent from the frontend
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
  // console.log("Checking what arrived from Postman:", req.body);

  // // If content is missing, stop here and tell Postman why
  // if (!req.body.content) {
  //   return res.status(400).json({
  //     error:
  //       "The server received your request, but the 'content' field was empty!",
  //   });
  // }
  // try {
  //   const expirationMinutes = parseInt(req.body.expirationMinutes);
  //   const expires_at = expirationMinutes
  //     ? new Date(Date.now() + expirationMinutes * 60000)
  //     : null;

  //   const newPaste = new Paste({
  //     content: req.body.content,
  //     expires_at: expires_at,
  //     max_views: req.body.maxViews,
  //   });

  //   const savedPaste = await newPaste.save();
  //   console.log("Success! Saved to DB:", savedPaste.customId);
  //   res.status(201).json({ id: savedPaste.customId });
  // } catch (error) {
  //   console.error("THE EXACT ERROR:", error);
  //   res.status(500).json({ error: "Failed to save paste" });
  // }
  try {
    const { content, expirationMinutes, maxViews } = req.body;

    // Logic to calculate expiry - Ensure expirationMinutes exists!
    let expires_at = null;
    if (expirationMinutes) {
      expires_at = new Date(Date.now() + parseInt(expirationMinutes) * 60000);
    }

    const newPaste = new Paste({
      content,
      customId: uuidv4(),
      expires_at: expires_at,
      max_views: maxViews ? parseInt(maxViews) : null, // Ensure it's a number or null
    });

    await newPaste.save();
    res.status(201).json({ id: newPaste.customId });
  } catch (err) {
    console.error("SERVER ERROR:", err); // This shows up in Render Logs
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
    // Only check if max_views was actually set
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
