const Player = require('../models/Player');
const GameSession = require('../models/GameSession');
const Leaderboard = require('../models/Leaderboard');

class PlayerController {
  static async createPlayer(req, res) {
    try {
      const { playerName, email } = req.body;
      
      // Check if player already exists
      let player = await Player.findByName(playerName);
      
      if (!player) {
        player = await Player.create({ playerName, email });
      }
      
      res.status(201).json({ 
        success: true, 
        player: { id: player.id, playerName: player.playerName } 
      });
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ success: false, error: "Failed to create player" });
    }
  }

  static async getPlayer(req, res) {
    try {
      const { playerId } = req.params;
      const player = await Player.findById(playerId);
      
      if (!player) {
        return res.status(404).json({ success: false, error: "Player not found" });
      }
      
      res.json({ success: true, player });
    } catch (error) {
      console.error("Error fetching player:", error);
      res.status(500).json({ success: false, error: "Failed to fetch player" });
    }
  }

  static async updatePlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const stats = req.body;
      
      const result = await Player.updateStats(playerId, stats);
      
      res.json({ success: true, result });
    } catch (error) {
      console.error("Error updating player stats:", error);
      res.status(500).json({ success: false, error: "Failed to update player stats" });
    }
  }

    // Arcade-style scoreboard: get all leaderboard entries sorted by score (each session is unique)
    static async getScoreboard(req, res) {
      try {
        const db = require('../index').getDB();
        const collection = db.collection('leaderboard');
        const scoreboard = await collection.find({})
          .project({ playerName: 1, score: 1, recordedAt: 1, _id: 0 })
          .sort({ score: -1 })
          .toArray();
        res.json({ success: true, scoreboard });
      } catch (error) {
        console.error("Error fetching scoreboard:", error);
        res.status(500).json({ success: false, error: "Failed to fetch scoreboard" });
      }
    }
}

module.exports = PlayerController;