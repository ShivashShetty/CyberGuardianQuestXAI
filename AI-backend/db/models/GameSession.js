const { getDB } = require('../index');
const { ObjectId } = require('mongodb');

class GameSession {
  static collectionName = 'gamesessions';

    static async findById(id) {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      return await collection.findOne({ _id: new ObjectId(id) });
    }

  static async create(sessionData) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    
    const session = {
      playerId: sessionData.playerId,
      playerName: sessionData.playerName,
      gameType: sessionData.gameType || 'cyberDefense',
      startTime: new Date(),
      endTime: null,
      score: 0,
      level: 1,
      wave: 1,
      xpEarned: 0,
      stats: {
        threatsKilled: 0,
        accuracy: 0,
        moneyEarned: 0,
        defensesPlaced: 0
      }
    };

    const result = await collection.insertOne(session);
    return { id: result.insertedId, ...session };
  }

  static async completeSession(sessionId, completionData) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    
    const updateData = {
      $set: {
        endTime: new Date(),
        score: completionData.score,
        level: completionData.level,
        wave: completionData.wave,
        xpEarned: completionData.xpEarned,
        stats: completionData.stats
      }
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(sessionId) },
      updateData
    );

    return result;
  }

  static async getPlayerSessions(playerId) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.find({ playerId: playerId }).toArray();
  }
}

module.exports = GameSession;