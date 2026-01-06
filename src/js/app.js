// TypeRacer Arena - Main Application

import { typingGame } from './game.js';
import { playerManager } from './players.js';
import { getText, getRandomText, CATEGORIES } from './content.js';
import { calculateXP, calculateScore, getLevelProgress, checkAchievements, getAchievementById } from './levels.js';
import { getTheme, saveTheme, getUnlocks, updatePlayerXP, updatePlayerStats, checkLevelUnlocks, getAchievements, addAchievement, getSetting, setSetting } from './storage.js';
import * as UI from './ui.js';

// App State
const state = {
  currentScreen: 'title',
  playerCount: 1,
  gameMode: 'quick', // quick, campaign, custom
  selectedCategory: 'classics',
  selectedDifficulty: 'medium',
  currentText: null,
  sessionRounds: 0,
  pendingTurnData: null, // Data waiting to be processed after modal dismiss
  gameStarted: false // Track if current game has started (for prompt)
};

// Initialize the application
function init() {
  UI.initElements();

  // Load and apply saved theme
  const savedTheme = getTheme();
  UI.applyTheme(savedTheme);

  // Set up event listeners
  setupEventListeners();

  // Render initial categories
  UI.renderCategories(state.selectedCategory);

  console.log('TypeRacer Arena initialized!');
}

// Set up all event listeners
function setupEventListeners() {
  // Theme toggles
  document.querySelectorAll('[id^="theme-switch"]').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const newTheme = e.target.checked ? 'light' : 'dark';
      saveTheme(newTheme);
      UI.applyTheme(newTheme);
    });
  });

  // Navigation buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', handleAction);
  });

  // Player count buttons
  document.querySelectorAll('[data-players]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const count = parseInt(e.currentTarget.dataset.players);
      setPlayerCount(count);
    });
  });

  // Mode cards
  document.querySelectorAll('[data-mode]').forEach(card => {
    card.addEventListener('click', (e) => {
      const mode = e.currentTarget.dataset.mode;
      selectMode(mode);
    });
  });

  // Category selection (delegated)
  document.getElementById('categories-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.category-card');
    if (card && !card.classList.contains('locked')) {
      selectCategory(card.dataset.category);
    }
  });

  // Difficulty selection
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!e.currentTarget.classList.contains('locked')) {
        selectDifficulty(e.currentTarget.dataset.difficulty);
      }
    });
  });

  // Typing input
  document.getElementById('typing-input').addEventListener('input', handleTypingInput);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeydown);
}

// Handle action buttons
function handleAction(e) {
  const action = e.currentTarget.dataset.action;

  switch (action) {
    case 'start-game':
      navigateTo('setup');
      break;
    case 'view-stats':
      // TODO: Implement stats screen
      alert('Stats coming soon!');
      break;
    case 'back-to-title':
      navigateTo('title');
      break;
    case 'back-to-setup':
      navigateTo('setup');
      break;
    case 'back-to-mode':
      navigateTo('mode');
      break;
    case 'go-to-mode':
      initializePlayers();
      navigateTo('mode');
      break;
    case 'start-round':
      startRound();
      break;
    case 'next-round':
      handleNextRound();
      break;
    case 'modal-continue':
      handleModalContinue();
      break;
    case 'open-settings':
      openSettings();
      break;
    case 'close-settings':
      closeSettings();
      break;
  }
}

// Navigate to a screen
function navigateTo(screen) {
  state.currentScreen = screen;
  UI.showScreen(screen);

  // Screen-specific initialization
  if (screen === 'setup') {
    UI.updatePlayerInputs(state.playerCount);
    // Focus first input
    setTimeout(() => {
      const firstInput = document.querySelector('#player-inputs input');
      if (firstInput) firstInput.focus();
    }, 100);
  }
}

// Set player count
function setPlayerCount(count) {
  state.playerCount = count;

  // Update button states
  document.querySelectorAll('[data-players]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.players) === count);
  });

  UI.updatePlayerInputs(count);
}

// Initialize players from inputs
function initializePlayers() {
  const names = UI.getPlayerNames(state.playerCount);
  playerManager.setPlayers(names);
}

// Select game mode
function selectMode(mode) {
  state.gameMode = mode;

  // Update card states
  document.querySelectorAll('[data-mode]').forEach(card => {
    card.classList.toggle('selected', card.dataset.mode === mode);
  });

  // Navigate based on mode
  if (mode === 'quick') {
    // Quick play: random category & difficulty
    const unlocks = getUnlocks();
    state.selectedCategory = unlocks[Math.floor(Math.random() * unlocks.length)];
    state.selectedDifficulty = 'medium';
    startRound();
  } else {
    // For custom mode, unlock all categories
    const unlockAll = mode === 'custom';
    UI.renderCategories(state.selectedCategory, unlockAll);
    navigateTo('category');
  }
}

// Select category
function selectCategory(categoryId) {
  state.selectedCategory = categoryId;
  const unlockAll = state.gameMode === 'custom';
  UI.renderCategories(categoryId, unlockAll);
}

// Select difficulty
function selectDifficulty(difficulty) {
  state.selectedDifficulty = difficulty;

  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.difficulty === difficulty);
  });
}

// Start a game round
async function startRound() {
  console.log('Starting round...');

  // Get text for this round
  state.currentText = getText(state.selectedCategory, state.selectedDifficulty);
  console.log('Text:', state.currentText.text.substring(0, 50) + '...');

  // Reset game started state
  state.gameStarted = false;

  // Initialize game
  typingGame.init(state.currentText.text);

  // Apply settings
  typingGame.setBackspaceMode(getSetting('backspaceMode'));

  // Set up game callbacks
  typingGame.onUpdate = (stats) => {
    UI.updateLiveStats(stats);
    UI.renderTextDisplay(typingGame.getCharacterStates());
  };

  typingGame.onError = () => {
    UI.showInputError();
  };

  typingGame.onComplete = (finalStats) => {
    handleRoundComplete(finalStats);
  };

  // Update UI
  UI.updateCurrentPlayer(playerManager.getCurrentPlayer());
  UI.renderTextDisplay(typingGame.getCharacterStates());
  UI.updateLiveStats({ wpm: 0, accuracy: 100, progress: 0, formattedTime: '0:00', currentIndex: 0, totalChars: state.currentText.text.length });
  UI.showGamePrompt(true);
  UI.setSourceText(state.currentText.source);

  // Navigate to game screen
  navigateTo('game');

  // Show countdown
  await UI.showCountdown();

  // Clear and focus input
  UI.clearInput();
  UI.focusInput();
}

// Handle typing input
function handleTypingInput(e) {
  const value = e.target.value;

  // Hide prompt on first keystroke
  if (!state.gameStarted && value.length > 0) {
    state.gameStarted = true;
    UI.showGamePrompt(false);
  }

  // processInput returns what the value should be (handles backspace blocking)
  const correctedValue = typingGame.processInput(value);
  if (correctedValue !== value) {
    // Backspace was blocked - restore the input value
    e.target.value = correctedValue;
  }
}

// Handle round completion for current player
function handleRoundComplete(finalStats) {
  state.sessionRounds++;

  // Calculate score and XP
  const scoreData = calculateScore(finalStats.wpm, finalStats.accuracy, finalStats.timeSeconds, state.selectedDifficulty);
  const xpEarned = calculateXP(finalStats.wpm, finalStats.accuracy, state.selectedDifficulty);

  // Record player's score
  playerManager.recordScore(finalStats.wpm, finalStats.accuracy, finalStats.timeSeconds, scoreData.totalScore);

  // Update player stats in storage
  const currentPlayer = playerManager.getCurrentPlayer();
  const { player, leveledUp } = updatePlayerXP(currentPlayer.name, xpEarned);
  updatePlayerStats(currentPlayer.name, finalStats.wpm, finalStats.wordsTyped);

  // Check for new achievements
  const existingAchievements = getAchievements(currentPlayer.name);
  const newAchievements = checkAchievements({
    roundsCompleted: player.gamesPlayed,
    wpm: finalStats.wpm,
    accuracy: finalStats.accuracy,
    sessionRounds: state.sessionRounds
  }, existingAchievements);

  // Save new achievements
  newAchievements.forEach(achId => addAchievement(currentPlayer.name, achId));

  // Check for new unlocks based on level
  const newUnlocks = checkLevelUnlocks(player.level);

  const isLastPlayer = playerManager.isLastPlayerTurn();
  const isMatchEnd = isLastPlayer && playerManager.currentRound >= playerManager.totalRounds;

  // Store pending data for after modal
  state.pendingTurnData = {
    xpEarned,
    player,
    leveledUp,
    newAchievements,
    newUnlocks,
    isLastPlayer,
    isMatchEnd
  };

  // Show the turn complete modal
  UI.showTurnModal({
    playerName: currentPlayer.name,
    wpm: finalStats.wpm,
    accuracy: finalStats.accuracy,
    time: finalStats.formattedTime,
    baseScore: scoreData.baseScore,
    accuracyBonus: scoreData.accuracyBonus,
    timeBonus: scoreData.timeBonus,
    difficultyMult: scoreData.difficultyMultiplier,
    totalScore: scoreData.totalScore,
    xp: xpEarned,
    isLastPlayer,
    isMatchEnd,
    isWinner: false
  });
}

// Handle modal continue button
function handleModalContinue() {
  UI.hideTurnModal();

  if (!state.pendingTurnData) return;

  const { xpEarned, player, leveledUp, newAchievements, newUnlocks, isLastPlayer, isMatchEnd } = state.pendingTurnData;

  // Show notifications
  if (newAchievements.length > 0) {
    newAchievements.forEach(achId => {
      const ach = getAchievementById(achId);
      if (ach) {
        showNotification(`${ach.icon} Achievement: ${ach.name}!`);
      }
    });
  }

  if (leveledUp) {
    showNotification(`🎉 Level Up! Now level ${player.level}!`);
  }

  if (newUnlocks.length > 0) {
    newUnlocks.forEach(catId => {
      const cat = CATEGORIES.find(c => c.id === catId);
      if (cat) {
        showNotification(`🔓 Unlocked: ${cat.name}!`);
      }
    });
  }

  // Proceed to next step
  if (isLastPlayer) {
    showRoundResults(xpEarned, player, leveledUp, newAchievements, newUnlocks);
  } else {
    // Next player's turn
    playerManager.nextPlayer();
    startPlayerTurn();
  }

  state.pendingTurnData = null;
}

// Start next player's turn (same text)
async function startPlayerTurn() {
  // Reset game started state
  state.gameStarted = false;

  // Reset game with same text
  typingGame.init(state.currentText.text);

  // Apply settings
  typingGame.setBackspaceMode(getSetting('backspaceMode'));

  // Re-register game callbacks
  typingGame.onUpdate = (stats) => {
    UI.updateLiveStats(stats);
    UI.renderTextDisplay(typingGame.getCharacterStates());
  };
  typingGame.onError = () => {
    UI.showInputError();
  };
  typingGame.onComplete = (finalStats) => {
    handleRoundComplete(finalStats);
  };

  // Update UI
  UI.updateCurrentPlayer(playerManager.getCurrentPlayer());
  UI.renderTextDisplay(typingGame.getCharacterStates());
  UI.updateLiveStats({ wpm: 0, accuracy: 100, progress: 0, formattedTime: '0:00', currentIndex: 0, totalChars: state.currentText.text.length });
  UI.showGamePrompt(true);

  // Show countdown
  await UI.showCountdown();

  // Clear and focus input
  UI.clearInput();
  UI.focusInput();
}

// Show round results
function showRoundResults(xpEarned, player, leveledUp, newAchievements, newUnlocks) {
  const results = playerManager.getRoundResults();
  const isMatchEnd = playerManager.currentRound >= playerManager.totalRounds;

  // Determine title
  let title = 'Round Complete!';
  if (isMatchEnd) {
    const winner = playerManager.getMatchWinner();
    title = `${winner.name} Wins!`;
  }

  const subtitle = isMatchEnd
    ? 'Final Results'
    : `Round ${playerManager.currentRound} of ${playerManager.totalRounds}`;

  // Update UI
  UI.renderScoreboard(results, isMatchEnd);
  UI.updateResults(title, subtitle, xpEarned, getLevelProgress(player.xp), isMatchEnd);

  // Navigate to results
  navigateTo('results');

  // Show confetti for winners
  if (isMatchEnd) {
    UI.showConfetti();
  }
}

// Handle next round button
function handleNextRound() {
  const isMatchEnd = playerManager.currentRound >= playerManager.totalRounds;

  if (isMatchEnd) {
    // Reset for new match
    playerManager.resetScores();
    state.sessionRounds = 0;
    navigateTo('mode');
  } else {
    // Start next round
    playerManager.startNextRound();
    startRound();
  }
}

// Handle keyboard shortcuts
function handleKeydown(e) {
  // Handle settings modal
  if (isSettingsOpen()) {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      closeSettings();
    }
    return;
  }

  // Enter to dismiss modal
  if (e.key === 'Enter' && UI.isModalOpen()) {
    e.preventDefault();
    handleModalContinue();
    return;
  }

  // Enter on title screen starts game
  if (state.currentScreen === 'title' && e.key === 'Enter') {
    e.preventDefault();
    navigateTo('setup');
    return;
  }

  // Enter in setup continues to mode select (works even in input fields)
  if (state.currentScreen === 'setup' && e.key === 'Enter') {
    e.preventDefault();
    initializePlayers();
    navigateTo('mode');
    return;
  }

  // Enter on mode screen selects Quick Play
  if (state.currentScreen === 'mode' && e.key === 'Enter') {
    e.preventDefault();
    selectMode('quick');
    return;
  }

  // Number keys on mode screen: 1=Quick, 2=Campaign, 3=Custom
  if (state.currentScreen === 'mode') {
    if (e.key === '1') {
      e.preventDefault();
      selectMode('quick');
      return;
    } else if (e.key === '2') {
      e.preventDefault();
      selectMode('campaign');
      return;
    } else if (e.key === '3') {
      e.preventDefault();
      selectMode('custom');
      return;
    }
  }

  // Enter on category screen starts round
  if (state.currentScreen === 'category' && e.key === 'Enter') {
    e.preventDefault();
    startRound();
    return;
  }

  // Enter on results screen goes to next round
  if (state.currentScreen === 'results' && e.key === 'Enter') {
    e.preventDefault();
    handleNextRound();
    return;
  }

  // Escape returns to previous screen
  if (e.key === 'Escape') {
    // Close modal first if open
    if (UI.isModalOpen()) {
      handleModalContinue();
      return;
    }

    switch (state.currentScreen) {
      case 'setup':
        navigateTo('title');
        break;
      case 'mode':
        navigateTo('setup');
        break;
      case 'category':
        navigateTo('mode');
        break;
      case 'results':
        navigateTo('mode');
        break;
    }
  }
}

// Settings management
function openSettings() {
  const settingsModal = document.getElementById('settings-modal');
  const backspaceSelect = document.getElementById('setting-backspace');

  // Load current setting
  backspaceSelect.value = getSetting('backspaceMode');

  settingsModal.classList.add('active');
}

function closeSettings() {
  const settingsModal = document.getElementById('settings-modal');
  const backspaceSelect = document.getElementById('setting-backspace');

  // Save setting
  setSetting('backspaceMode', backspaceSelect.value);

  settingsModal.classList.remove('active');
}

function isSettingsOpen() {
  return document.getElementById('settings-modal')?.classList.contains('active');
}

// Show notification (simple alert for now, could be improved)
function showNotification(message) {
  // Create toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-surface);
    color: var(--text-primary);
    padding: 1rem 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Add animation keyframes if not exists
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove after delay
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
