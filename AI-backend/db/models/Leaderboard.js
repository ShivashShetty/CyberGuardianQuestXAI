const { getDB } = require('../index');
const { ObjectId } = require('mongodb');

class Leaderboard {
  static collectionName = 'leaderboard';

  static async updateLeaderboard(playerId, playerName, score, gameType) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    // Always insert a new entry for each session
    await collection.insertOne({
      playerId: playerId,
      playerName: playerName,
      score: score,
      level: 1, // This would need to be updated from player data
      gameType: gameType,
      recordedAt: new Date()
    });
  }

  static async getTopPlayers(gameType, limit = 10) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.find({ gameType: gameType })
      .sort({ score: -1 })
      .limit(limit)
      .toArray();
  }
}

module.exports = Leaderboard;