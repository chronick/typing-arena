// Players Management Tests

import { describe, test, assertEqual, assert, logger } from './tests.js';

// Mock PlayerManager matching src/js/players.js
class MockPlayerManager {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.roundScores = [];
    this.matchScores = [];
    this.currentRound = 1;
    this.totalRounds = 3;
  }

  setPlayers(names) {
    const colors = ['#e94560', '#4ecca3', '#6bcbff', '#ffd93d'];
    this.players = names.map((name, index) => ({
      id: index + 1,
      name: name || `Player ${index + 1}`,
      color: colors[index % colors.length]
    }));
    this.resetScores();
    return this.players;
  }

  resetScores() {
    this.currentPlayerIndex = 0;
    this.currentRound = 1;
    this.roundScores = this.players.map(() => null);
    this.matchScores = this.players.map(() => ({
      totalScore: 0,
      totalWPM: 0,
      totalAccuracy: 0,
      rounds: 0
    }));
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  isRoundComplete() {
    return this.roundScores.every(score => score !== null);
  }

  recordScore(wpm, accuracy, time, score) {
    this.roundScores[this.currentPlayerIndex] = { wpm, accuracy, time, score };
    const matchScore = this.matchScores[this.currentPlayerIndex];
    matchScore.totalScore += score;
    matchScore.totalWPM += wpm;
    matchScore.totalAccuracy += accuracy;
    matchScore.rounds++;
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return this.getCurrentPlayer();
  }

  getRoundResults() {
    return this.players
      .map((player, index) => ({
        ...player,
        ...this.roundScores[index],
        rank: 0
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  getMatchResults() {
    return this.players
      .map((player, index) => ({
        ...player,
        ...this.matchScores[index],
        avgWPM: this.matchScores[index].rounds > 0
          ? Math.round(this.matchScores[index].totalWPM / this.matchScores[index].rounds)
          : 0,
        avgAccuracy: this.matchScores[index].rounds > 0
          ? Math.round(this.matchScores[index].totalAccuracy / this.matchScores[index].rounds)
          : 0,
        rank: 0
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  startNextRound() {
    this.currentRound++;
    this.currentPlayerIndex = 0;
    this.roundScores = this.players.map(() => null);
  }

  isMatchComplete() {
    return this.currentRound > this.totalRounds && this.isRoundComplete();
  }

  getRoundWinner() {
    return this.getRoundResults()[0];
  }

  getMatchWinner() {
    return this.getMatchResults()[0];
  }

  setTotalRounds(rounds) {
    this.totalRounds = rounds;
  }

  getPlayerCount() {
    return this.players.length;
  }

  isLastPlayerTurn() {
    return this.currentPlayerIndex === this.players.length - 1;
  }
}

export function playersTests() {
  describe('Players - Setup', () => {
    test('setPlayers() creates correct number of players', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob', 'Charlie']);
      assertEqual(pm.getPlayerCount(), 3);
    });

    test('setPlayers() assigns names correctly', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      assertEqual(pm.players[0].name, 'Alice');
      assertEqual(pm.players[1].name, 'Bob');
    });

    test('setPlayers() uses default names for empty strings', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['', 'Bob', '']);
      assertEqual(pm.players[0].name, 'Player 1');
      assertEqual(pm.players[1].name, 'Bob');
      assertEqual(pm.players[2].name, 'Player 3');
    });

    test('setPlayers() assigns unique IDs', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B', 'C', 'D']);
      assertEqual(pm.players[0].id, 1);
      assertEqual(pm.players[1].id, 2);
      assertEqual(pm.players[2].id, 3);
      assertEqual(pm.players[3].id, 4);
    });

    test('setPlayers() assigns colors', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B']);
      assert(pm.players[0].color !== undefined, 'Player 1 should have color');
      assert(pm.players[1].color !== undefined, 'Player 2 should have color');
    });
  });

  describe('Players - Turn Management', () => {
    test('getCurrentPlayer() returns first player initially', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      assertEqual(pm.getCurrentPlayer().name, 'Alice');
    });

    test('nextPlayer() advances to next player', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob', 'Charlie']);
      pm.nextPlayer();
      assertEqual(pm.getCurrentPlayer().name, 'Bob');
    });

    test('nextPlayer() wraps around', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      pm.nextPlayer();
      pm.nextPlayer();
      assertEqual(pm.getCurrentPlayer().name, 'Alice');
    });

    test('isLastPlayerTurn() false for first player', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B', 'C']);
      assertEqual(pm.isLastPlayerTurn(), false);
    });

    test('isLastPlayerTurn() true for last player', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B', 'C']);
      pm.nextPlayer();
      pm.nextPlayer();
      assertEqual(pm.isLastPlayerTurn(), true);
    });
  });

  describe('Players - Score Recording', () => {
    test('recordScore() stores score for current player', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      pm.recordScore(60, 95, 45, 1000);
      assertEqual(pm.roundScores[0].wpm, 60);
      assertEqual(pm.roundScores[0].accuracy, 95);
      assertEqual(pm.roundScores[0].score, 1000);
    });

    test('recordScore() updates match totals', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice']);
      pm.recordScore(60, 95, 45, 1000);
      assertEqual(pm.matchScores[0].totalScore, 1000);
      assertEqual(pm.matchScores[0].totalWPM, 60);
      assertEqual(pm.matchScores[0].rounds, 1);
    });

    test('isRoundComplete() false when not all players scored', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      pm.recordScore(60, 95, 45, 1000);
      assertEqual(pm.isRoundComplete(), false);
    });

    test('isRoundComplete() true when all players scored', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      pm.recordScore(60, 95, 45, 1000);
      pm.nextPlayer();
      pm.recordScore(70, 98, 40, 1200);
      assertEqual(pm.isRoundComplete(), true);
    });
  });

  describe('Players - Results & Rankings', () => {
    test('getRoundResults() sorts by score descending', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob', 'Charlie']);
      pm.recordScore(50, 90, 60, 800);
      pm.nextPlayer();
      pm.recordScore(70, 95, 50, 1200);
      pm.nextPlayer();
      pm.recordScore(60, 92, 55, 1000);

      const results = pm.getRoundResults();
      assertEqual(results[0].name, 'Bob');
      assertEqual(results[1].name, 'Charlie');
      assertEqual(results[2].name, 'Alice');
    });

    test('getRoundResults() assigns correct ranks', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B']);
      pm.recordScore(50, 90, 60, 500);
      pm.nextPlayer();
      pm.recordScore(70, 95, 50, 700);

      const results = pm.getRoundResults();
      assertEqual(results[0].rank, 1);
      assertEqual(results[1].rank, 2);
    });

    test('getRoundWinner() returns highest scorer', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice', 'Bob']);
      pm.recordScore(50, 90, 60, 500);
      pm.nextPlayer();
      pm.recordScore(80, 98, 40, 1500);

      const winner = pm.getRoundWinner();
      assertEqual(winner.name, 'Bob');
    });

    test('getMatchResults() calculates averages', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['Alice']);
      pm.recordScore(60, 90, 50, 1000);
      pm.startNextRound();
      pm.recordScore(80, 100, 40, 1500);

      const results = pm.getMatchResults();
      assertEqual(results[0].avgWPM, 70); // (60+80)/2
      assertEqual(results[0].avgAccuracy, 95); // (90+100)/2
    });
  });

  describe('Players - Match Flow', () => {
    test('startNextRound() increments round counter', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B']);
      assertEqual(pm.currentRound, 1);
      pm.startNextRound();
      assertEqual(pm.currentRound, 2);
    });

    test('startNextRound() resets player index', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B']);
      pm.nextPlayer();
      pm.startNextRound();
      assertEqual(pm.currentPlayerIndex, 0);
    });

    test('startNextRound() clears round scores', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B']);
      pm.recordScore(60, 90, 50, 1000);
      pm.startNextRound();
      assertEqual(pm.roundScores[0], null);
    });

    test('setTotalRounds() changes match length', () => {
      const pm = new MockPlayerManager();
      pm.setTotalRounds(5);
      assertEqual(pm.totalRounds, 5);
    });

    test('resetScores() clears all match data', () => {
      const pm = new MockPlayerManager();
      pm.setPlayers(['A', 'B']);
      pm.recordScore(60, 90, 50, 1000);
      pm.startNextRound();
      pm.resetScores();
      assertEqual(pm.currentRound, 1);
      assertEqual(pm.matchScores[0].totalScore, 0);
    });
  });
}
