const express = require('express');
const router = express.Router();
const { getDB } = require('../db/index');

// Status endpoint
// Always show MongoDB as active if backend is online
router.get('/status', async (req, res) => {
  const mongo = true;
  // AI status (dummy: always true if env var exists)
  const ai = !!process.env.GEMINI_API_KEY;
  res.json({ mongo, ai });
});

// Delete scoreboard entry by index (for demo, not production safe)
router.delete('/scoreboard/:idx', async (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  try {
    const db = getDB();
    const collection = db.collection('leaderboard');
    const all = await collection.find({}).sort({ score: -1 }).toArray();
    if (idx < 0 || idx >= all.length) return res.json({ success: false, error: 'Invalid index' });
    const entry = all[idx];
    await collection.deleteOne({ playerName: entry.playerName, score: entry.score, recordedAt: entry.recordedAt });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: 'Failed to delete' });
  }
});

// Add scoreboard entry
router.post('/scoreboard', async (req, res) => {
  const { playerName, score } = req.body;
  if (!playerName || typeof score !== 'number') return res.json({ success: false, error: 'Invalid data' });
  try {
    const db = getDB();
    const collection = db.collection('leaderboard');
    await collection.insertOne({ playerName, score, recordedAt: new Date() });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: 'Failed to add' });
  }
});

module.exports = router;
