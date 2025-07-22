const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Invalid question." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "moonshotai/kimi-k2:free", // ✅ This is the correct model
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant with expertise in cybersecurity.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // required
          "X-Title": "Cyber Guardian Quest", // optional, shown on OpenRouter site
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content || "No answer.";
    console.log("✅ AI:", aiResponse);
    res.json({ answer: aiResponse });
  } catch (error) {
    console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI backend failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Kimi (OpenRouter) backend running at http://localhost:${PORT}`);
});
