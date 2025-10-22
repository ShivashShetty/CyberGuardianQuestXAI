const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const axios = require("axios");

// Import MongoDB modules
const { connectDB } = require('./db/index');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB().then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});



// Gemini AI endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in .env file");
}



app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Invalid question." });
  }

  // System prompt to guide Gemini's style
  const systemPrompt =
    "You are a helpful cybersecurity expert. Answer user questions in a concise, clear, and detailed way, but keep responses under 200 words. Use plain text, avoid markdown, stars, dashes, or bullet points. Use short paragraphs and direct explanations.";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: question }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    // Gemini returns response.data.candidates[0].content.parts[0].text
    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer.";
    console.log("✅ Gemini AI:", aiResponse);
    res.json({ answer: aiResponse });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI backend failed." });
  }
});


// Add MongoDB API routes
app.use('/api', apiRoutes);

// Add admin API routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Gemini AI backend running at http://localhost:${PORT}`);
});
