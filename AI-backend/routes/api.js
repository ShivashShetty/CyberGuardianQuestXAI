const express = require('express');
const router = express.Router();

const PlayerController = require('../db/controllers/playerController');
const GameController = require('../db/controllers/gameController');
const LeaderboardController = require('../db/controllers/leaderboardController');

// Player routes
router.post('/players', PlayerController.createPlayer);
router.get('/players/:playerId', PlayerController.getPlayer);
router.put('/players/:playerId/stats', PlayerController.updatePlayerStats);

// Scoreboard route
router.get('/scoreboard', PlayerController.getScoreboard);

// Game session routes
router.post('/games/start', GameController.startGameSession);
router.post('/games/:sessionId/complete', GameController.completeGameSession);

// Leaderboard routes
router.get('/leaderboard/:gameType', LeaderboardController.getLeaderboard);

module.exports = router;