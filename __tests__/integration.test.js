// Integration Tests - Full Game Scenarios

import { describe, test, assertEqual, assert, assertInRange, logger } from './tests.js';

// Full game state simulation
class GameSimulation {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.roundScores = [];
    this.matchScores = [];
    this.currentRound = 1;
    this.totalRounds = 3;
    this.targetText = '';
    this.gameActive = false;
  }

  setup(playerNames, rounds = 3) {
    this.players = playerNames.map((name, i) => ({
      id: i + 1,
      name,
      xp: 0,
      level: 1
    }));
    this.totalRounds = rounds;
    this.currentRound = 1;
    this.currentPlayerIndex = 0;
    this.roundScores = this.players.map(() => null);
    this.matchScores = this.players.map(() => ({ total: 0, rounds: 0 }));
  }

  setTargetText(text) {
    this.targetText = text;
  }

  simulateTyping(wpm, accuracy) {
    // Calculate time based on WPM
    const wordCount = this.targetText.split(/\s+/).length;
    const timeMinutes = wordCount / wpm;
    const timeSeconds = Math.round(timeMinutes * 60);

    // Calculate score
    const baseScore = wpm * 10;
    const accuracyBonus = Math.round(accuracy * 2);
    const timeBonus = Math.round(Math.max(0, (120 - timeSeconds) * 0.5));
    const totalScore = baseScore + accuracyBonus + timeBonus;

    // Calculate XP
    const xp = Math.round((wpm * accuracy / 100) * 1.5);

    return {
      wpm,
      accuracy,
      timeSeconds,
      timeBonus,
      totalScore,
      xp,
      complete: true
    };
  }

  recordPlayerResult(result) {
    this.roundScores[this.currentPlayerIndex] = result;
    this.matchScores[this.currentPlayerIndex].total += result.totalScore;
    this.matchScores[this.currentPlayerIndex].rounds++;
    this.players[this.currentPlayerIndex].xp += result.xp;
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  isRoundComplete() {
    return this.roundScores.every(s => s !== null);
  }

  startNextRound() {
    this.currentRound++;
    this.currentPlayerIndex = 0;
    this.roundScores = this.players.map(() => null);
  }

  getRoundWinner() {
    let maxScore = -1;
    let winner = null;
    this.roundScores.forEach((score, i) => {
      if (score && score.totalScore > maxScore) {
        maxScore = score.totalScore;
        winner = this.players[i];
      }
    });
    return winner;
  }

  getMatchWinner() {
    let maxScore = -1;
    let winner = null;
    this.matchScores.forEach((score, i) => {
      if (score.total > maxScore) {
        maxScore = score.total;
        winner = this.players[i];
      }
    });
    return winner;
  }
}

export function integrationTests() {
  describe('Integration - Full 2-Player Game', () => {
    test('Complete 3-round match between 2 players', () => {
      const sim = new GameSimulation();
      sim.setup(['Alice', 'Bob'], 3);
      sim.setTargetText('The quick brown fox jumps over the lazy dog.');

      // Round 1
      const r1Alice = sim.simulateTyping(60, 95);
      sim.recordPlayerResult(r1Alice);
      sim.nextPlayer();
      const r1Bob = sim.simulateTyping(70, 98);
      sim.recordPlayerResult(r1Bob);
      logger.debug('Round 1', { alice: r1Alice.totalScore, bob: r1Bob.totalScore, winner: sim.getRoundWinner().name });
      assert(sim.isRoundComplete(), 'Round 1 should be complete');
      assertEqual(sim.getRoundWinner().name, 'Bob');
      sim.startNextRound();

      // Round 2
      const r2Alice = sim.simulateTyping(75, 100);
      sim.recordPlayerResult(r2Alice);
      sim.nextPlayer();
      const r2Bob = sim.simulateTyping(65, 92);
      sim.recordPlayerResult(r2Bob);
      logger.debug('Round 2', { alice: r2Alice.totalScore, bob: r2Bob.totalScore, winner: sim.getRoundWinner().name });
      assert(sim.isRoundComplete(), 'Round 2 should be complete');
      assertEqual(sim.getRoundWinner().name, 'Alice');
      sim.startNextRound();

      // Round 3
      const r3Alice = sim.simulateTyping(68, 96);
      sim.recordPlayerResult(r3Alice);
      sim.nextPlayer();
      const r3Bob = sim.simulateTyping(72, 99);
      sim.recordPlayerResult(r3Bob);
      logger.debug('Round 3', { alice: r3Alice.totalScore, bob: r3Bob.totalScore, winner: sim.getRoundWinner().name });
      assert(sim.isRoundComplete(), 'Round 3 should be complete');

      assertEqual(sim.currentRound, 3);
      const winner = sim.getMatchWinner();
      logger.info('Match complete', { winner: winner.name, matchScores: sim.matchScores });
      assert(winner !== null, 'Should have a match winner');
    });
  });

  describe('Integration - 4-Player Game', () => {
    test('Complete single round with 4 players', () => {
      const sim = new GameSimulation();
      sim.setup(['P1', 'P2', 'P3', 'P4'], 1);
      sim.setTargetText('Test text for typing.');

      const results = [];
      results.push(sim.simulateTyping(50, 90));
      sim.recordPlayerResult(results[0]);
      sim.nextPlayer();
      results.push(sim.simulateTyping(60, 85));
      sim.recordPlayerResult(results[1]);
      sim.nextPlayer();
      results.push(sim.simulateTyping(70, 95));
      sim.recordPlayerResult(results[2]);
      sim.nextPlayer();
      results.push(sim.simulateTyping(55, 100));
      sim.recordPlayerResult(results[3]);

      logger.debug('4-player round', { scores: results.map((r, i) => ({ player: `P${i+1}`, score: r.totalScore })) });
      assert(sim.isRoundComplete(), 'Round should be complete');
      assertEqual(sim.getRoundWinner().name, 'P3');
    });

    test('4 players accumulate XP correctly', () => {
      const sim = new GameSimulation();
      sim.setup(['A', 'B', 'C', 'D'], 2);
      sim.setTargetText('Short text.');

      // Round 1
      [80, 60, 70, 90].forEach((wpm, i) => {
        if (i > 0) sim.nextPlayer();
        sim.recordPlayerResult(sim.simulateTyping(wpm, 95));
      });
      sim.startNextRound();

      // Round 2
      [85, 65, 75, 95].forEach((wpm, i) => {
        if (i > 0) sim.nextPlayer();
        sim.recordPlayerResult(sim.simulateTyping(wpm, 95));
      });

      logger.debug('4 players XP', { players: sim.players.map(p => ({ name: p.name, xp: p.xp })) });
      sim.players.forEach(p => {
        assert(p.xp > 0, `${p.name} should have XP`);
      });
    });
  });

  describe('Integration - Edge Cases', () => {
    test('Single player game', () => {
      const sim = new GameSimulation();
      sim.setup(['Solo'], 1);
      sim.setTargetText('Solo typing test.');

      const result = sim.simulateTyping(75, 100);
      sim.recordPlayerResult(result);
      logger.debug('Single player', { result });
      assert(sim.isRoundComplete(), 'Round should be complete');
      assertEqual(sim.getMatchWinner().name, 'Solo');
    });

    test('Perfect score scenario', () => {
      const sim = new GameSimulation();
      sim.setup(['Pro'], 1);
      sim.setTargetText('Quick test.');

      const result = sim.simulateTyping(100, 100);
      sim.recordPlayerResult(result);
      logger.debug('Perfect score', result);

      assertEqual(result.accuracy, 100);
      assert(result.totalScore > 1000, 'Perfect score should be high');
    });

    test('Very slow typing', () => {
      const sim = new GameSimulation();
      sim.setup(['Slow'], 1);
      // Need 30+ words so 15 WPM takes > 120 seconds (no time bonus)
      sim.setTargetText('A simple sentence to type slowly that contains many many words so that when typed at a very slow pace of fifteen words per minute it will take longer than two minutes to complete.');

      const result = sim.simulateTyping(15, 85);
      sim.recordPlayerResult(result);

      logger.debug('Very slow typing', {
        wordCount: sim.targetText.split(/\s+/).length,
        wpm: result.wpm,
        timeSeconds: result.timeSeconds,
        timeBonus: result.timeBonus,
        totalScore: result.totalScore
      });

      assert(result.totalScore > 0, 'Should still get points');
      assert(result.timeBonus === 0, `No time bonus for slow typing (got ${result.timeBonus}, timeSeconds=${result.timeSeconds})`);
    });

    test('Tie-breaker scenario (same scores)', () => {
      const sim = new GameSimulation();
      sim.setup(['A', 'B'], 1);
      sim.setTargetText('Test.');

      // Both get same WPM and accuracy
      sim.recordPlayerResult(sim.simulateTyping(60, 95));
      sim.nextPlayer();
      sim.recordPlayerResult(sim.simulateTyping(60, 95));

      assert(sim.isRoundComplete(), 'Round should be complete');
      // First player wins ties (by array order)
      assertEqual(sim.getRoundWinner().name, 'A');
    });
  });

  describe('Integration - Score Calculations', () => {
    test('Score increases with WPM', () => {
      const sim = new GameSimulation();
      sim.setTargetText('Test text.');

      const slow = sim.simulateTyping(40, 95);
      const fast = sim.simulateTyping(80, 95);

      assert(fast.totalScore > slow.totalScore, 'Faster typing should score higher');
    });

    test('Score increases with accuracy', () => {
      const sim = new GameSimulation();
      sim.setTargetText('Test text.');

      const low = sim.simulateTyping(60, 80);
      const high = sim.simulateTyping(60, 100);

      assert(high.totalScore > low.totalScore, 'Better accuracy should score higher');
    });

    test('XP scales with performance', () => {
      const sim = new GameSimulation();
      sim.setTargetText('Test text.');

      const poor = sim.simulateTyping(30, 70);
      const good = sim.simulateTyping(80, 98);

      assert(good.xp > poor.xp, 'Better performance should give more XP');
    });
  });

  describe('Integration - Round Transitions', () => {
    test('Round scores reset between rounds', () => {
      const sim = new GameSimulation();
      sim.setup(['A', 'B'], 2);
      sim.setTargetText('Test.');

      // Round 1
      sim.recordPlayerResult(sim.simulateTyping(60, 95));
      sim.nextPlayer();
      sim.recordPlayerResult(sim.simulateTyping(70, 98));
      sim.startNextRound();

      assertEqual(sim.roundScores[0], null);
      assertEqual(sim.roundScores[1], null);
    });

    test('Match scores persist between rounds', () => {
      const sim = new GameSimulation();
      sim.setup(['A'], 2);
      sim.setTargetText('Test.');

      sim.recordPlayerResult(sim.simulateTyping(60, 95));
      const r1Score = sim.matchScores[0].total;
      sim.startNextRound();

      sim.recordPlayerResult(sim.simulateTyping(70, 98));
      const r2Score = sim.matchScores[0].total;

      assert(r2Score > r1Score, 'Match score should accumulate');
    });

    test('Player index resets each round', () => {
      const sim = new GameSimulation();
      sim.setup(['A', 'B', 'C'], 2);
      sim.setTargetText('Test.');

      sim.nextPlayer();
      sim.nextPlayer();
      assertEqual(sim.currentPlayerIndex, 2);

      sim.startNextRound();
      assertEqual(sim.currentPlayerIndex, 0);
    });
  });
}
