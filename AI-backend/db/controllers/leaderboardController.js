const Leaderboard = require('../models/Leaderboard');

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      
      const topPlayers = await Leaderboard.getTopPlayers(gameType, limit);
      
      res.json({ success: true, leaderboard: topPlayers });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ success: false, error: "Failed to fetch leaderboard" });
    }
  }
}

module.exports = LeaderboardController;