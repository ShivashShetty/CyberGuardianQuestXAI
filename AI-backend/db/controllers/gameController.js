const GameSession = require('../models/GameSession');
const Player = require('../models/Player');
const Leaderboard = require('../models/Leaderboard');

class GameController {
  static async startGameSession(req, res) {
    try {
      const { playerId, playerName, gameType } = req.body;
      
      const session = await GameSession.create({ playerId, playerName, gameType });
      
      res.status(201).json({ success: true, session });
    } catch (error) {
      console.error("Error starting game session:", error);
      res.status(500).json({ success: false, error: "Failed to start game session" });
    }
  }

  static async completeGameSession(req, res) {
    try {
      const { sessionId } = req.params;
      const completionData = req.body;
      
      // Complete the session
      await GameSession.completeSession(sessionId, completionData);
      
      // Update player stats
      const session = await GameSession.findById(sessionId);

      if (session) {
        let playerId = session.playerId;
        // If playerId is not a valid ObjectId string, try to fetch by playerName
        if (!playerId || typeof playerId !== 'string' || playerId.length !== 24) {
          const player = await Player.findByName(session.playerName);
          if (player && player._id) {
            playerId = player._id.toString();
          } else {
            throw new Error('Player not found or invalid playerId');
          }
        }
        await Player.updateStats(playerId, {
          score: completionData.score,
          xpEarned: completionData.xpEarned
        });
        // Update leaderboard
        await Leaderboard.updateLeaderboard(
          playerId,
          session.playerName,
          completionData.score,
          session.gameType
        );
      }
      
      res.json({ success: true, message: "Game session completed" });
    } catch (error) {
      console.error("Error completing game session:", error);
      res.status(500).json({ success: false, error: "Failed to complete game session" });
    }
  }
}

module.exports = GameController;