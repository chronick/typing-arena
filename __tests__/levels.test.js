// Levels & Progression Tests

import { describe, test, assertEqual, assertInRange, assertDeepEqual, logger } from './tests.js';

// Mock implementations matching src/js/levels.js
const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2,
  expert: 3
};

function calculateXP(wpm, accuracy, difficulty = 'medium') {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1;
  const baseXP = Math.round((wpm * accuracy / 100) * multiplier);
  return Math.max(baseXP, 10);
}

function calculateScore(wpm, accuracy, timeSeconds, difficulty = 'medium') {
  const baseScore = wpm * 10;
  const accuracyBonus = Math.round(accuracy * 2);
  const timeBonus = Math.round(Math.max(0, (120 - timeSeconds) * 0.5));
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1;
  const totalScore = Math.round((baseScore + accuracyBonus + timeBonus) * difficultyMultiplier);

  return {
    baseScore,
    accuracyBonus,
    timeBonus,
    difficultyMultiplier,
    totalScore
  };
}

function getLevelFromXP(xp) {
  return Math.min(Math.floor(xp / 1000) + 1, 50);
}

function getXPForNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevelXP = currentLevel * 1000;
  return nextLevelXP - currentXP;
}

function getLevelProgress(currentXP) {
  const xpInCurrentLevel = currentXP % 1000;
  return Math.round((xpInCurrentLevel / 1000) * 100);
}

function checkAchievements(stats, existingAchievements = []) {
  const newAchievements = [];

  if (stats.roundsCompleted >= 1 && !existingAchievements.includes('first_steps')) {
    newAchievements.push('first_steps');
  }
  if (stats.wpm >= 80 && !existingAchievements.includes('speed_demon')) {
    newAchievements.push('speed_demon');
  }
  if (stats.wpm >= 100 && !existingAchievements.includes('centurion')) {
    newAchievements.push('centurion');
  }
  if (stats.accuracy === 100 && !existingAchievements.includes('perfectionist')) {
    newAchievements.push('perfectionist');
  }
  if (stats.sessionRounds >= 10 && !existingAchievements.includes('marathon')) {
    newAchievements.push('marathon');
  }

  return newAchievements;
}

export function levelsTests() {
  describe('Levels - XP Calculation', () => {
    test('calculateXP() basic calculation', () => {
      const xp = calculateXP(60, 100, 'medium');
      logger.debug('calculateXP(60, 100, medium)', { wpm: 60, accuracy: 100, difficulty: 'medium', xp });
      assertEqual(xp, 90);
    });

    test('calculateXP() minimum XP is 10', () => {
      const xp = calculateXP(1, 10, 'easy');
      logger.debug('calculateXP(1, 10, easy)', { wpm: 1, accuracy: 10, difficulty: 'easy', xp });
      assertEqual(xp, 10);
    });

    test('calculateXP() easy difficulty (1x)', () => {
      const xp = calculateXP(100, 100, 'easy');
      logger.debug('calculateXP(100, 100, easy)', { wpm: 100, accuracy: 100, difficulty: 'easy', multiplier: 1, xp });
      assertEqual(xp, 100);
    });

    test('calculateXP() hard difficulty (2x)', () => {
      const xp = calculateXP(50, 100, 'hard');
      logger.debug('calculateXP(50, 100, hard)', { wpm: 50, accuracy: 100, difficulty: 'hard', multiplier: 2, xp });
      assertEqual(xp, 100);
    });

    test('calculateXP() expert difficulty (3x)', () => {
      const xp = calculateXP(50, 100, 'expert');
      logger.debug('calculateXP(50, 100, expert)', { wpm: 50, accuracy: 100, difficulty: 'expert', multiplier: 3, xp });
      assertEqual(xp, 150);
    });

    test('calculateXP() accounts for accuracy', () => {
      const xp100 = calculateXP(60, 100, 'easy');
      const xp50 = calculateXP(60, 50, 'easy');
      logger.debug('calculateXP() accuracy comparison', { xp100, xp50 });
      assertEqual(xp100, 60);
      assertEqual(xp50, 30);
    });
  });

  describe('Levels - Score Calculation', () => {
    test('calculateScore() returns breakdown object', () => {
      const score = calculateScore(60, 100, 60, 'easy');
      logger.debug('calculateScore() breakdown', score);
      assertEqual(typeof score.baseScore, 'number');
      assertEqual(typeof score.accuracyBonus, 'number');
      assertEqual(typeof score.timeBonus, 'number');
      assertEqual(typeof score.difficultyMultiplier, 'number');
      assertEqual(typeof score.totalScore, 'number');
    });

    test('calculateScore() base score is wpm * 10', () => {
      const score = calculateScore(75, 100, 60, 'easy');
      logger.debug('calculateScore() baseScore', { wpm: 75, baseScore: score.baseScore });
      assertEqual(score.baseScore, 750);
    });

    test('calculateScore() accuracy bonus is accuracy * 2', () => {
      const score = calculateScore(50, 95, 60, 'easy');
      logger.debug('calculateScore() accuracyBonus', { accuracy: 95, accuracyBonus: score.accuracyBonus });
      assertEqual(score.accuracyBonus, 190);
    });

    test('calculateScore() time bonus for fast completion', () => {
      const fast = calculateScore(50, 100, 30, 'easy');
      const slow = calculateScore(50, 100, 120, 'easy');
      logger.debug('calculateScore() timeBonus', { fast: { time: 30, bonus: fast.timeBonus }, slow: { time: 120, bonus: slow.timeBonus } });
      assertEqual(fast.timeBonus, 45);
      assertEqual(slow.timeBonus, 0);
    });

    test('calculateScore() no negative time bonus', () => {
      const score = calculateScore(50, 100, 180, 'easy');
      logger.debug('calculateScore() negative time check', { time: 180, timeBonus: score.timeBonus });
      assertEqual(score.timeBonus, 0);
    });

    test('calculateScore() applies difficulty multiplier', () => {
      const easy = calculateScore(50, 100, 60, 'easy');
      const hard = calculateScore(50, 100, 60, 'hard');
      logger.debug('calculateScore() difficulty multiplier', { easy: easy.totalScore, hard: hard.totalScore, ratio: hard.totalScore / easy.totalScore });
      assertEqual(easy.difficultyMultiplier, 1);
      assertEqual(hard.difficultyMultiplier, 2);
      assertEqual(hard.totalScore, easy.totalScore * 2);
    });
  });

  describe('Levels - Level Calculation', () => {
    test('getLevelFromXP() level 1 at 0 XP', () => {
      const level = getLevelFromXP(0);
      logger.debug('getLevelFromXP(0)', { xp: 0, level });
      assertEqual(level, 1);
    });

    test('getLevelFromXP() level 1 at 999 XP', () => {
      const level = getLevelFromXP(999);
      logger.debug('getLevelFromXP(999)', { xp: 999, level });
      assertEqual(level, 1);
    });

    test('getLevelFromXP() level 2 at 1000 XP', () => {
      const level = getLevelFromXP(1000);
      logger.debug('getLevelFromXP(1000)', { xp: 1000, level });
      assertEqual(level, 2);
    });

    test('getLevelFromXP() level 10 at 9000 XP', () => {
      const level = getLevelFromXP(9000);
      logger.debug('getLevelFromXP(9000)', { xp: 9000, level });
      assertEqual(level, 10);
    });

    test('getLevelFromXP() caps at level 50', () => {
      const level = getLevelFromXP(100000);
      logger.debug('getLevelFromXP(100000)', { xp: 100000, level });
      assertEqual(level, 50);
    });

    test('getXPForNextLevel() from level 1', () => {
      const xpNeeded = getXPForNextLevel(500);
      logger.debug('getXPForNextLevel(500)', { currentXP: 500, xpNeeded });
      assertEqual(xpNeeded, 500);
    });

    test('getXPForNextLevel() just before level up', () => {
      const xpNeeded = getXPForNextLevel(999);
      logger.debug('getXPForNextLevel(999)', { currentXP: 999, xpNeeded });
      assertEqual(xpNeeded, 1);
    });

    test('getLevelProgress() 0% at level start', () => {
      const progress = getLevelProgress(1000);
      logger.debug('getLevelProgress(1000)', { xp: 1000, progress });
      assertEqual(progress, 0);
    });

    test('getLevelProgress() 50% halfway', () => {
      const progress = getLevelProgress(500);
      logger.debug('getLevelProgress(500)', { xp: 500, progress });
      assertEqual(progress, 50);
    });

    test('getLevelProgress() 99% near level up', () => {
      const progress = getLevelProgress(990);
      logger.debug('getLevelProgress(990)', { xp: 990, progress });
      assertEqual(progress, 99);
    });
  });

  describe('Levels - Achievements', () => {
    test('checkAchievements() first_steps on first round', () => {
      const stats = { roundsCompleted: 1, wpm: 30, accuracy: 80 };
      const achievements = checkAchievements(stats);
      logger.debug('checkAchievements() first_steps', { stats, achievements });
      assertEqual(achievements.includes('first_steps'), true);
    });

    test('checkAchievements() speed_demon at 80 WPM', () => {
      const stats = { roundsCompleted: 1, wpm: 80, accuracy: 90 };
      const achievements = checkAchievements(stats);
      logger.debug('checkAchievements() speed_demon', { stats, achievements });
      assertEqual(achievements.includes('speed_demon'), true);
    });

    test('checkAchievements() centurion at 100 WPM', () => {
      const stats = { roundsCompleted: 1, wpm: 100, accuracy: 95 };
      const achievements = checkAchievements(stats);
      logger.debug('checkAchievements() centurion', { stats, achievements });
      assertEqual(achievements.includes('centurion'), true);
    });

    test('checkAchievements() perfectionist at 100% accuracy', () => {
      const stats = { roundsCompleted: 1, wpm: 50, accuracy: 100 };
      const achievements = checkAchievements(stats);
      logger.debug('checkAchievements() perfectionist', { stats, achievements });
      assertEqual(achievements.includes('perfectionist'), true);
    });

    test('checkAchievements() marathon at 10 session rounds', () => {
      const stats = { roundsCompleted: 1, wpm: 50, accuracy: 90, sessionRounds: 10 };
      const achievements = checkAchievements(stats);
      logger.debug('checkAchievements() marathon', { stats, achievements });
      assertEqual(achievements.includes('marathon'), true);
    });

    test('checkAchievements() does not duplicate existing', () => {
      const stats = { roundsCompleted: 5, wpm: 100, accuracy: 100 };
      const existing = ['first_steps', 'centurion'];
      const achievements = checkAchievements(stats, existing);
      logger.debug('checkAchievements() no duplicates', { stats, existing, achievements });
      assertEqual(achievements.includes('first_steps'), false);
      assertEqual(achievements.includes('centurion'), false);
    });

    test('checkAchievements() multiple achievements at once', () => {
      const stats = { roundsCompleted: 1, wpm: 100, accuracy: 100 };
      const achievements = checkAchievements(stats);
      logger.debug('checkAchievements() multiple', { stats, achievements, count: achievements.length });
      assertEqual(achievements.length >= 3, true);
    });
  });
}
