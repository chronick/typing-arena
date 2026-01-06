// Storage Tests (using mock localStorage)

import { describe, test, assertEqual, assert, logger } from './tests.js';

// Mock localStorage for testing
class MockStorage {
  constructor() {
    this.data = {};
  }
  getItem(key) {
    return this.data[key] || null;
  }
  setItem(key, value) {
    this.data[key] = value;
  }
  removeItem(key) {
    delete this.data[key];
  }
  clear() {
    this.data = {};
  }
}

// Storage functions using mock
function createStorageFunctions(storage) {
  const KEYS = {
    PLAYERS: 'typeracer_players',
    UNLOCKS: 'typeracer_unlocks',
    HIGHSCORES: 'typeracer_highscores',
    THEME: 'typeracer_theme',
    GAME_STATE: 'typeracer_game_state'
  };

  return {
    getPlayers() {
      try {
        const data = storage.getItem(KEYS.PLAYERS);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },

    savePlayers(players) {
      storage.setItem(KEYS.PLAYERS, JSON.stringify(players));
    },

    getPlayerByName(name) {
      const players = this.getPlayers();
      return players.find(p => p.name.toLowerCase() === name.toLowerCase());
    },

    updatePlayerXP(name, xpGained) {
      const players = this.getPlayers();
      let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

      if (!player) {
        player = { name, xp: 0, level: 1, gamesPlayed: 0 };
        players.push(player);
      }

      player.xp += xpGained;
      player.gamesPlayed++;
      const newLevel = Math.min(Math.floor(player.xp / 1000) + 1, 50);
      const leveledUp = newLevel > player.level;
      player.level = newLevel;

      this.savePlayers(players);
      return { player, leveledUp };
    },

    getUnlocks() {
      try {
        const data = storage.getItem(KEYS.UNLOCKS);
        return data ? JSON.parse(data) : ['classics'];
      } catch {
        return ['classics'];
      }
    },

    saveUnlocks(unlocks) {
      storage.setItem(KEYS.UNLOCKS, JSON.stringify(unlocks));
    },

    unlockCategory(categoryId) {
      const unlocks = this.getUnlocks();
      if (!unlocks.includes(categoryId)) {
        unlocks.push(categoryId);
        this.saveUnlocks(unlocks);
        return true;
      }
      return false;
    },

    isCategoryUnlocked(categoryId) {
      return this.getUnlocks().includes(categoryId);
    },

    getHighscores() {
      try {
        const data = storage.getItem(KEYS.HIGHSCORES);
        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    },

    saveHighscore(category, score) {
      const highscores = this.getHighscores();
      if (!highscores[category] || score > highscores[category]) {
        highscores[category] = score;
        storage.setItem(KEYS.HIGHSCORES, JSON.stringify(highscores));
        return true;
      }
      return false;
    },

    getTheme() {
      return storage.getItem(KEYS.THEME) || 'dark';
    },

    saveTheme(theme) {
      storage.setItem(KEYS.THEME, theme);
    },

    saveGameState(state) {
      const saveData = { ...state, savedAt: Date.now() };
      storage.setItem(KEYS.GAME_STATE, JSON.stringify(saveData));
    },

    loadGameState() {
      try {
        const data = storage.getItem(KEYS.GAME_STATE);
        if (!data) return null;
        const state = JSON.parse(data);
        if (state.savedAt && Date.now() - state.savedAt > 3600000) {
          storage.removeItem(KEYS.GAME_STATE);
          return null;
        }
        return state;
      } catch {
        return null;
      }
    },

    clearGameState() {
      storage.removeItem(KEYS.GAME_STATE);
    }
  };
}

export function storageTests() {
  describe('Storage - Players', () => {
    test('getPlayers() returns empty array initially', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const players = s.getPlayers();
      assertEqual(players.length, 0);
    });

    test('savePlayers() and getPlayers() roundtrip', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const testPlayers = [{ name: 'Alice', xp: 100 }, { name: 'Bob', xp: 200 }];
      s.savePlayers(testPlayers);
      const loaded = s.getPlayers();
      assertEqual(loaded.length, 2);
      assertEqual(loaded[0].name, 'Alice');
    });

    test('getPlayerByName() finds player case-insensitive', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.savePlayers([{ name: 'Alice', xp: 100 }]);
      const player = s.getPlayerByName('ALICE');
      assertEqual(player.name, 'Alice');
    });

    test('getPlayerByName() returns undefined for unknown player', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const player = s.getPlayerByName('Unknown');
      assertEqual(player, undefined);
    });

    test('updatePlayerXP() creates new player if not exists', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.updatePlayerXP('NewPlayer', 100);
      const player = s.getPlayerByName('NewPlayer');
      assertEqual(player.xp, 100);
      assertEqual(player.level, 1);
    });

    test('updatePlayerXP() adds XP to existing player', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.updatePlayerXP('Alice', 500);
      s.updatePlayerXP('Alice', 300);
      const player = s.getPlayerByName('Alice');
      assertEqual(player.xp, 800);
    });

    test('updatePlayerXP() levels up player', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const { leveledUp } = s.updatePlayerXP('Alice', 1500);
      assertEqual(leveledUp, true);
      const player = s.getPlayerByName('Alice');
      assertEqual(player.level, 2);
    });

    test('updatePlayerXP() increments gamesPlayed', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.updatePlayerXP('Alice', 100);
      s.updatePlayerXP('Alice', 100);
      s.updatePlayerXP('Alice', 100);
      const player = s.getPlayerByName('Alice');
      assertEqual(player.gamesPlayed, 3);
    });
  });

  describe('Storage - Unlocks', () => {
    test('getUnlocks() returns classics by default', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const unlocks = s.getUnlocks();
      assertEqual(unlocks.includes('classics'), true);
    });

    test('unlockCategory() adds new category', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const result = s.unlockCategory('poetry');
      assertEqual(result, true);
      assertEqual(s.isCategoryUnlocked('poetry'), true);
    });

    test('unlockCategory() returns false if already unlocked', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.unlockCategory('poetry');
      const result = s.unlockCategory('poetry');
      assertEqual(result, false);
    });

    test('isCategoryUnlocked() returns correct status', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      assertEqual(s.isCategoryUnlocked('classics'), true);
      assertEqual(s.isCategoryUnlocked('expert_mode'), false);
    });
  });

  describe('Storage - Highscores', () => {
    test('getHighscores() returns empty object initially', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const scores = s.getHighscores();
      assertEqual(Object.keys(scores).length, 0);
    });

    test('saveHighscore() saves new highscore', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const result = s.saveHighscore('classics', 1000);
      assertEqual(result, true);
      assertEqual(s.getHighscores().classics, 1000);
    });

    test('saveHighscore() updates if higher', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.saveHighscore('classics', 1000);
      const result = s.saveHighscore('classics', 1500);
      assertEqual(result, true);
      assertEqual(s.getHighscores().classics, 1500);
    });

    test('saveHighscore() does not update if lower', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.saveHighscore('classics', 1000);
      const result = s.saveHighscore('classics', 500);
      assertEqual(result, false);
      assertEqual(s.getHighscores().classics, 1000);
    });
  });

  describe('Storage - Theme', () => {
    test('getTheme() returns dark by default', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      assertEqual(s.getTheme(), 'dark');
    });

    test('saveTheme() and getTheme() roundtrip', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.saveTheme('light');
      assertEqual(s.getTheme(), 'light');
    });
  });

  describe('Storage - Game State', () => {
    test('loadGameState() returns null initially', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      assertEqual(s.loadGameState(), null);
    });

    test('saveGameState() and loadGameState() roundtrip', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      const state = { screen: 'game', playerCount: 3 };
      s.saveGameState(state);
      const loaded = s.loadGameState();
      assertEqual(loaded.screen, 'game');
      assertEqual(loaded.playerCount, 3);
    });

    test('saveGameState() adds savedAt timestamp', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.saveGameState({ test: true });
      const loaded = s.loadGameState();
      assert(loaded.savedAt !== undefined, 'Should have savedAt');
      assert(loaded.savedAt <= Date.now(), 'savedAt should be in past');
    });

    test('clearGameState() removes saved state', () => {
      const storage = new MockStorage();
      const s = createStorageFunctions(storage);
      s.saveGameState({ test: true });
      s.clearGameState();
      assertEqual(s.loadGameState(), null);
    });
  });
}
