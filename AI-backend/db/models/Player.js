const { getDB } = require('../index');
const { ObjectId } = require('mongodb');

class Player {
  static collectionName = 'players';

  static async create(playerData) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    
    const player = {
      playerName: playerData.playerName,
      email: playerData.email || null,
      createdAt: new Date(),
      lastActive: new Date(),
      totalXP: 0,
      level: 1,
      completedModules: [],
      achievements: [],
      gameStats: {
        highScore: 0,
        gamesPlayed: 0,
        totalScore: 0,
        averageScore: 0
      },
      settings: {
        theme: 'default',
        notifications: true
      }
    };

    const result = await collection.insertOne(player);
    return { id: result.insertedId, ...player };
  }

  static async findByName(playerName) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.findOne({ playerName: playerName });
  }

  static async findById(id) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async updateStats(playerId, stats) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    
    const updateData = {
      $set: { lastActive: new Date() },
      $inc: {
        'gameStats.gamesPlayed': 1,
        'gameStats.totalScore': stats.score,
        'totalXP': stats.xpEarned
      }
    };

    // Update high score if applicable
    if (stats.score > 0) {
      updateData.$max = { 'gameStats.highScore': stats.score };
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(playerId) },
      updateData
    );

    return result;
  }
}

module.exports = Player;