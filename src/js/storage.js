// TypeRacer Arena - Local Storage Manager

const STORAGE_KEYS = {
  PLAYERS: 'typeracer_players',
  UNLOCKS: 'typeracer_unlocks',
  HIGHSCORES: 'typeracer_highscores',
  THEME: 'typeracer_theme',
  SOUND: 'typeracer_sound',
  ACHIEVEMENTS: 'typeracer_achievements',
  GAME_STATE: 'typeracer_game_state'
};

const DEFAULT_UNLOCKS = ['classics']; // First stage unlocked by default

export function getPlayers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePlayers(players) {
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
}

export function getPlayerByName(name) {
  const players = getPlayers();
  return players.find(p => p.name.toLowerCase() === name.toLowerCase());
}

export function updatePlayerXP(name, xpGained) {
  const players = getPlayers();
  let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

  if (!player) {
    player = {
      name,
      xp: 0,
      level: 1,
      achievements: [],
      gamesPlayed: 0,
      bestWPM: 0,
      totalWordsTyped: 0
    };
    players.push(player);
  }

  player.xp += xpGained;
  player.gamesPlayed++;

  // Level up calculation (1000 XP per level)
  const newLevel = Math.floor(player.xp / 1000) + 1;
  const leveledUp = newLevel > player.level;
  player.level = Math.min(newLevel, 50);

  savePlayers(players);

  return { player, leveledUp };
}

export function updatePlayerStats(name, wpm, wordsTyped) {
  const players = getPlayers();
  const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

  if (player) {
    player.bestWPM = Math.max(player.bestWPM || 0, wpm);
    player.totalWordsTyped = (player.totalWordsTyped || 0) + wordsTyped;
    savePlayers(players);
  }
}

export function getUnlocks() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.UNLOCKS);
    return data ? JSON.parse(data) : [...DEFAULT_UNLOCKS];
  } catch {
    return [...DEFAULT_UNLOCKS];
  }
}

export function saveUnlocks(unlocks) {
  localStorage.setItem(STORAGE_KEYS.UNLOCKS, JSON.stringify(unlocks));
}

export function unlockCategory(categoryId) {
  const unlocks = getUnlocks();
  if (!unlocks.includes(categoryId)) {
    unlocks.push(categoryId);
    saveUnlocks(unlocks);
    return true;
  }
  return false;
}

export function isCategoryUnlocked(categoryId) {
  return getUnlocks().includes(categoryId);
}

export function getHighscores() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HIGHSCORES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveHighscore(category, score) {
  const highscores = getHighscores();
  if (!highscores[category] || score > highscores[category]) {
    highscores[category] = score;
    localStorage.setItem(STORAGE_KEYS.HIGHSCORES, JSON.stringify(highscores));
    return true;
  }
  return false;
}

export function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getSoundEnabled() {
  const data = localStorage.getItem(STORAGE_KEYS.SOUND);
  return data === null ? true : data === 'true';
}

export function saveSoundEnabled(enabled) {
  localStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
}

export function getAchievements(playerName) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const all = data ? JSON.parse(data) : {};
    return all[playerName] || [];
  } catch {
    return [];
  }
}

export function addAchievement(playerName, achievementId) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const all = data ? JSON.parse(data) : {};
    if (!all[playerName]) all[playerName] = [];
    if (!all[playerName].includes(achievementId)) {
      all[playerName].push(achievementId);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(all));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Check and unlock categories based on player level
export function checkLevelUnlocks(level) {
  const unlockMap = {
    3: 'poetry',
    5: 'code',
    8: 'random',
    12: 'humor'
  };

  const newUnlocks = [];
  for (const [reqLevel, category] of Object.entries(unlockMap)) {
    if (level >= parseInt(reqLevel) && unlockCategory(category)) {
      newUnlocks.push(category);
    }
  }
  return newUnlocks;
}

// Game state persistence
export function saveGameState(state) {
  try {
    const saveData = {
      ...state,
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(saveData));
  } catch (e) {
    console.warn('Failed to save game state:', e);
  }
}

export function loadGameState() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (!data) return null;

    const state = JSON.parse(data);

    // Expire saved state after 1 hour
    if (state.savedAt && Date.now() - state.savedAt > 3600000) {
      clearGameState();
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
}
