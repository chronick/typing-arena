#!/usr/bin/env node
// TypeRacer Arena - CLI Test Runner
// Run with: node test/run-tests.js

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
    this.currentGroup = null;
  }

  describe(group, fn) {
    this.currentGroup = group;
    fn();
    this.currentGroup = null;
  }

  test(name, fn) {
    this.tests.push({ name, group: this.currentGroup, fn });
  }

  async run() {
    const startTime = Date.now();
    this.results = [];

    for (const test of this.tests) {
      try {
        await test.fn();
        this.results.push({ name: test.name, group: test.group, passed: true });
      } catch (error) {
        this.results.push({ name: test.name, group: test.group, passed: false, error: error.message });
      }
    }

    return {
      passed: this.results.every(r => r.passed),
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.passed).length,
        failed: this.results.filter(r => !r.passed).length
      },
      tests: this.results
    };
  }
}

// Assertions
function assert(condition, message = 'Assertion failed') {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertInRange(value, min, max, message) {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be between ${min} and ${max}`);
  }
}

// Create runner instance
const runner = new TestRunner();
const describe = (g, f) => runner.describe(g, f);
const test = (n, f) => runner.test(n, f);

// ============================================================
// GAME TESTS
// ============================================================

class MockTypingGame {
  constructor() {
    this.targetText = '';
    this.typedText = '';
    this.startTime = null;
    this.isActive = false;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.currentIndex = 0;
  }

  init(text) {
    this.targetText = text;
    this.typedText = '';
    this.startTime = null;
    this.isActive = false;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.currentIndex = 0;
  }

  start() {
    this.isActive = true;
    this.startTime = Date.now();
  }

  processInput(inputText) {
    if (!this.startTime && inputText.length > 0) this.start();
    if (!this.isActive) return;

    this.typedText = inputText;
    this.currentIndex = inputText.length;
    this.correctChars = 0;
    this.incorrectChars = 0;

    for (let i = 0; i < inputText.length; i++) {
      if (i < this.targetText.length) {
        if (inputText[i] === this.targetText[i]) this.correctChars++;
        else this.incorrectChars++;
      }
    }
  }

  calculateWPM(chars, seconds) {
    if (seconds <= 0) return 0;
    return (chars / 5) / (seconds / 60);
  }

  calculateAccuracy() {
    const total = this.correctChars + this.incorrectChars;
    if (total === 0) return 100;
    return (this.correctChars / total) * 100;
  }

  calculateProgress() {
    if (this.targetText.length === 0) return 0;
    return Math.min((this.currentIndex / this.targetText.length) * 100, 100);
  }
}

describe('Game - Initialization', () => {
  test('init() resets all state', () => {
    const game = new MockTypingGame();
    game.init('Hello World');
    assertEqual(game.targetText, 'Hello World');
    assertEqual(game.isActive, false);
  });
});

describe('Game - Input Processing', () => {
  test('processInput() starts game on first keystroke', () => {
    const game = new MockTypingGame();
    game.init('test');
    game.processInput('t');
    assertEqual(game.isActive, true);
  });

  test('processInput() counts correct characters', () => {
    const game = new MockTypingGame();
    game.init('hello');
    game.processInput('hel');
    assertEqual(game.correctChars, 3);
  });

  test('processInput() counts incorrect characters', () => {
    const game = new MockTypingGame();
    game.init('hello');
    game.processInput('hxllo');
    assertEqual(game.incorrectChars, 1);
  });
});

describe('Game - WPM Calculation', () => {
  test('calculateWPM() returns 0 for 0 seconds', () => {
    const game = new MockTypingGame();
    assertEqual(game.calculateWPM(50, 0), 0);
  });

  test('calculateWPM() calculates correctly', () => {
    const game = new MockTypingGame();
    assertEqual(game.calculateWPM(50, 60), 10);
  });
});

describe('Game - Accuracy', () => {
  test('100% accuracy for perfect typing', () => {
    const game = new MockTypingGame();
    game.init('hello');
    game.processInput('hello');
    assertEqual(game.calculateAccuracy(), 100);
  });

  test('50% accuracy for half correct', () => {
    const game = new MockTypingGame();
    game.init('abcd');
    game.processInput('abxx');
    assertEqual(game.calculateAccuracy(), 50);
  });
});

// ============================================================
// LEVELS TESTS
// ============================================================

const DIFFICULTY_MULTIPLIERS = { easy: 1, medium: 1.5, hard: 2, expert: 3 };

function calculateXP(wpm, accuracy, difficulty = 'medium') {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1;
  return Math.max(Math.round((wpm * accuracy / 100) * multiplier), 10);
}

function calculateScore(wpm, accuracy, timeSeconds, difficulty = 'medium') {
  const baseScore = wpm * 10;
  const accuracyBonus = Math.round(accuracy * 2);
  const timeBonus = Math.round(Math.max(0, (120 - timeSeconds) * 0.5));
  const mult = DIFFICULTY_MULTIPLIERS[difficulty] || 1;
  return { baseScore, accuracyBonus, timeBonus, difficultyMultiplier: mult, totalScore: Math.round((baseScore + accuracyBonus + timeBonus) * mult) };
}

function getLevelFromXP(xp) {
  return Math.min(Math.floor(xp / 1000) + 1, 50);
}

describe('Levels - XP Calculation', () => {
  test('calculateXP() basic calculation', () => {
    assertEqual(calculateXP(60, 100, 'medium'), 90);
  });

  test('calculateXP() minimum XP is 10', () => {
    assertEqual(calculateXP(1, 10, 'easy'), 10);
  });

  test('calculateXP() expert gives 3x', () => {
    assertEqual(calculateXP(50, 100, 'expert'), 150);
  });
});

describe('Levels - Score Calculation', () => {
  test('Base score is wpm * 10', () => {
    const score = calculateScore(75, 100, 60, 'easy');
    assertEqual(score.baseScore, 750);
  });

  test('Accuracy bonus is accuracy * 2', () => {
    const score = calculateScore(50, 95, 60, 'easy');
    assertEqual(score.accuracyBonus, 190);
  });

  test('Time bonus for fast completion', () => {
    const score = calculateScore(50, 100, 30, 'easy');
    assertEqual(score.timeBonus, 45);
  });
});

describe('Levels - Level Calculation', () => {
  test('Level 1 at 0 XP', () => {
    assertEqual(getLevelFromXP(0), 1);
  });

  test('Level 2 at 1000 XP', () => {
    assertEqual(getLevelFromXP(1000), 2);
  });

  test('Level caps at 50', () => {
    assertEqual(getLevelFromXP(100000), 50);
  });
});

// ============================================================
// PLAYERS TESTS
// ============================================================

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
    this.players = names.map((name, i) => ({ id: i + 1, name: name || `Player ${i + 1}` }));
    this.roundScores = this.players.map(() => null);
    this.matchScores = this.players.map(() => ({ total: 0, rounds: 0 }));
    this.currentPlayerIndex = 0;
    return this.players;
  }

  getCurrentPlayer() { return this.players[this.currentPlayerIndex]; }
  nextPlayer() { this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length; }
  isLastPlayerTurn() { return this.currentPlayerIndex === this.players.length - 1; }
  isRoundComplete() { return this.roundScores.every(s => s !== null); }

  recordScore(score) {
    this.roundScores[this.currentPlayerIndex] = score;
    this.matchScores[this.currentPlayerIndex].total += score;
    this.matchScores[this.currentPlayerIndex].rounds++;
  }

  startNextRound() {
    this.currentRound++;
    this.currentPlayerIndex = 0;
    this.roundScores = this.players.map(() => null);
  }
}

describe('Players - Setup', () => {
  test('setPlayers() creates correct count', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A', 'B', 'C']);
    assertEqual(pm.players.length, 3);
  });

  test('Uses default names for empty', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['', 'Bob']);
    assertEqual(pm.players[0].name, 'Player 1');
    assertEqual(pm.players[1].name, 'Bob');
  });
});

describe('Players - Turn Management', () => {
  test('First player is current initially', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['Alice', 'Bob']);
    assertEqual(pm.getCurrentPlayer().name, 'Alice');
  });

  test('nextPlayer() advances', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A', 'B']);
    pm.nextPlayer();
    assertEqual(pm.getCurrentPlayer().name, 'B');
  });

  test('nextPlayer() wraps around', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A', 'B']);
    pm.nextPlayer();
    pm.nextPlayer();
    assertEqual(pm.getCurrentPlayer().name, 'A');
  });

  test('isLastPlayerTurn() correct', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A', 'B']);
    assertEqual(pm.isLastPlayerTurn(), false);
    pm.nextPlayer();
    assertEqual(pm.isLastPlayerTurn(), true);
  });
});

describe('Players - Scoring', () => {
  test('recordScore() stores score', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A']);
    pm.recordScore(1000);
    assertEqual(pm.roundScores[0], 1000);
    assertEqual(pm.matchScores[0].total, 1000);
  });

  test('isRoundComplete() works', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A', 'B']);
    pm.recordScore(100);
    assertEqual(pm.isRoundComplete(), false);
    pm.nextPlayer();
    pm.recordScore(200);
    assertEqual(pm.isRoundComplete(), true);
  });
});

describe('Players - Round Flow', () => {
  test('startNextRound() increments round', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A']);
    assertEqual(pm.currentRound, 1);
    pm.startNextRound();
    assertEqual(pm.currentRound, 2);
  });

  test('startNextRound() resets scores', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['A']);
    pm.recordScore(100);
    pm.startNextRound();
    assertEqual(pm.roundScores[0], null);
  });
});

// ============================================================
// INTEGRATION TESTS
// ============================================================

describe('Integration - Full Game', () => {
  test('2-player 3-round game completes', () => {
    const pm = new MockPlayerManager();
    pm.setPlayers(['Alice', 'Bob']);

    // Round 1
    pm.recordScore(800); pm.nextPlayer();
    pm.recordScore(1000);
    assert(pm.isRoundComplete());
    pm.startNextRound();

    // Round 2
    pm.recordScore(900); pm.nextPlayer();
    pm.recordScore(850);
    pm.startNextRound();

    // Round 3
    pm.recordScore(950); pm.nextPlayer();
    pm.recordScore(920);

    assertEqual(pm.currentRound, 3);
    assertEqual(pm.matchScores[0].total, 800 + 900 + 950);
    assertEqual(pm.matchScores[1].total, 1000 + 850 + 920);
  });

  test('XP accumulates correctly', () => {
    let totalXP = 0;
    totalXP += calculateXP(60, 95, 'medium');
    totalXP += calculateXP(70, 98, 'medium');
    assert(totalXP > 100, 'Should accumulate XP');
  });
});

// ============================================================
// RUN TESTS
// ============================================================

async function main() {
  const results = await runner.run();

  // Output format based on args
  const args = process.argv.slice(2);

  if (args.includes('--json')) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('='.repeat(60));
    console.log('TYPERACER ARENA - TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Status: ${results.passed ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}`);
    console.log(`Passed: ${results.summary.passed}/${results.summary.total}`);
    console.log(`Failed: ${results.summary.failed}`);
    console.log(`Duration: ${results.duration}ms`);
    console.log('='.repeat(60));

    let currentGroup = null;
    for (const t of results.tests) {
      if (t.group !== currentGroup) {
        currentGroup = t.group;
        console.log(`\n\x1b[36m${t.group}\x1b[0m`);
      }
      const icon = t.passed ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
      console.log(`  ${icon} ${t.name}`);
      if (t.error) console.log(`    \x1b[31m${t.error}\x1b[0m`);
    }

    console.log('\n' + '='.repeat(60));
  }

  process.exit(results.passed ? 0 : 1);
}

main();
