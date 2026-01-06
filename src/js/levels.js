// TypeRacer Arena - Level & Progression System

export const ACHIEVEMENTS = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first round', icon: '👣' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Reach 80+ WPM', icon: '⚡' },
  { id: 'centurion', name: '100 WPM Club', description: 'Reach 100+ WPM', icon: '💯' },
  { id: 'perfectionist', name: 'Perfectionist', description: '100% accuracy in a round', icon: '✨' },
  { id: 'marathon', name: 'Marathon', description: 'Complete 10 rounds in one session', icon: '🏃' },
  { id: 'scholar', name: 'Scholar', description: 'Complete all Literary Classics', icon: '📚' },
  { id: 'poet', name: 'Poet', description: 'Complete all Poetry challenges', icon: '🎭' },
  { id: 'hacker', name: 'Hacker', description: 'Complete all Code challenges', icon: '💻' },
  { id: 'comedian', name: 'Comedian', description: 'Complete all Humor challenges', icon: '😂' },
  { id: 'completionist', name: 'Completionist', description: 'Unlock all content', icon: '🏆' }
];

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2,
  expert: 3
};

// Calculate XP earned for a round
export function calculateXP(wpm, accuracy, difficulty = 'medium') {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1;
  const baseXP = Math.round((wpm * accuracy / 100) * multiplier);
  return Math.max(baseXP, 10); // Minimum 10 XP
}

// Calculate score for a round (returns breakdown)
export function calculateScore(wpm, accuracy, timeSeconds, difficulty = 'medium') {
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

// Calculate level from total XP
export function getLevelFromXP(xp) {
  return Math.min(Math.floor(xp / 1000) + 1, 50);
}

// Get XP needed for next level
export function getXPForNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevelXP = currentLevel * 1000;
  return nextLevelXP - currentXP;
}

// Get progress percentage to next level
export function getLevelProgress(currentXP) {
  const xpInCurrentLevel = currentXP % 1000;
  return Math.round((xpInCurrentLevel / 1000) * 100);
}

// Check which achievements were earned
export function checkAchievements(stats, existingAchievements = []) {
  const newAchievements = [];

  // First Steps - complete first round
  if (stats.roundsCompleted >= 1 && !existingAchievements.includes('first_steps')) {
    newAchievements.push('first_steps');
  }

  // Speed Demon - 80+ WPM
  if (stats.wpm >= 80 && !existingAchievements.includes('speed_demon')) {
    newAchievements.push('speed_demon');
  }

  // 100 WPM Club
  if (stats.wpm >= 100 && !existingAchievements.includes('centurion')) {
    newAchievements.push('centurion');
  }

  // Perfectionist - 100% accuracy
  if (stats.accuracy === 100 && !existingAchievements.includes('perfectionist')) {
    newAchievements.push('perfectionist');
  }

  // Marathon - 10 rounds in session
  if (stats.sessionRounds >= 10 && !existingAchievements.includes('marathon')) {
    newAchievements.push('marathon');
  }

  return newAchievements;
}

// Get achievement by ID
export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Difficulty level descriptions
export const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', description: '20-40 words', wordRange: [20, 40] },
  { id: 'medium', name: 'Medium', description: '40-80 words', wordRange: [40, 80] },
  { id: 'hard', name: 'Hard', description: '80-120 words', wordRange: [80, 120] },
  { id: 'expert', name: 'Expert', description: '120+ words', wordRange: [120, 200] }
];

// Get difficulty by ID
export function getDifficultyById(id) {
  return DIFFICULTIES.find(d => d.id === id);
}
