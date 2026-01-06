// TypeRacer Arena - UI Management

import { CATEGORIES } from './content.js';
import { getUnlocks } from './storage.js';

// DOM Elements cache
let elements = {};

// Initialize DOM elements
export function initElements() {
  elements = {
    // Screens
    screens: {
      title: document.getElementById('screen-title'),
      setup: document.getElementById('screen-setup'),
      mode: document.getElementById('screen-mode'),
      category: document.getElementById('screen-category'),
      game: document.getElementById('screen-game'),
      results: document.getElementById('screen-results')
    },
    // Game elements
    textDisplay: document.getElementById('text-display'),
    typingInput: document.getElementById('typing-input'),
    progressFill: document.getElementById('progress-fill'),
    charsTyped: document.getElementById('chars-typed'),
    charsTotal: document.getElementById('chars-total'),
    liveWpm: document.getElementById('live-wpm'),
    liveAccuracy: document.getElementById('live-accuracy'),
    liveTime: document.getElementById('live-time'),
    currentAvatar: document.getElementById('current-avatar'),
    currentPlayerName: document.getElementById('current-player-name'),
    gamePrompt: document.getElementById('game-prompt'),
    sourceText: document.getElementById('source-text'),
    // Categories
    categoriesGrid: document.getElementById('categories-grid'),
    difficultyOptions: document.getElementById('difficulty-options'),
    // Player setup
    playerInputs: document.getElementById('player-inputs'),
    // Results
    scoreboard: document.getElementById('scoreboard'),
    resultsTitle: document.getElementById('results-title'),
    resultsSubtitle: document.getElementById('results-subtitle'),
    xpEarned: document.getElementById('xp-earned'),
    xpFill: document.getElementById('xp-fill'),
    btnNextRound: document.getElementById('btn-next-round'),
    // Overlays
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.getElementById('countdown-number'),
    confettiContainer: document.getElementById('confetti-container'),
    // Turn Modal
    turnModal: document.getElementById('turn-modal'),
    modalIcon: document.getElementById('modal-icon'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalWpm: document.getElementById('modal-wpm'),
    modalAccuracy: document.getElementById('modal-accuracy'),
    modalTime: document.getElementById('modal-time'),
    modalBaseScore: document.getElementById('modal-base-score'),
    modalAccuracyBonus: document.getElementById('modal-accuracy-bonus'),
    modalTimeBonus: document.getElementById('modal-time-bonus'),
    modalDifficultyMult: document.getElementById('modal-difficulty-mult'),
    modalTotalScore: document.getElementById('modal-total-score'),
    modalXp: document.getElementById('modal-xp'),
    modalContinueBtn: document.getElementById('modal-continue-btn'),
    modalHint: document.getElementById('modal-hint')
  };
}

// Switch to a different screen
export function showScreen(screenName) {
  Object.values(elements.screens).forEach(screen => {
    screen.classList.remove('active');
  });

  const target = elements.screens[screenName];
  if (target) {
    target.classList.add('active');
  }
}

// Render text display with character states
export function renderTextDisplay(characterStates) {
  elements.textDisplay.innerHTML = characterStates
    .map(({ char, state }) => {
      const displayChar = char === ' ' ? '&nbsp;' : escapeHtml(char);
      return `<span class="char ${state}">${displayChar}</span>`;
    })
    .join('');
}

// Update live stats during game
export function updateLiveStats(stats) {
  elements.liveWpm.textContent = stats.wpm;
  elements.liveAccuracy.textContent = `${stats.accuracy}%`;
  elements.liveTime.textContent = stats.formattedTime;
  elements.progressFill.style.width = `${stats.progress}%`;
  elements.charsTyped.textContent = stats.currentIndex;
  elements.charsTotal.textContent = stats.totalChars;
}

// Show error animation on input
export function showInputError() {
  elements.typingInput.classList.add('error');
  setTimeout(() => {
    elements.typingInput.classList.remove('error');
  }, 300);
}

// Update current player display
export function updateCurrentPlayer(player) {
  elements.currentAvatar.textContent = player.name.charAt(0).toUpperCase();
  elements.currentAvatar.style.background = player.color;
  elements.currentPlayerName.textContent = player.name;
}

// Render categories grid
// When unlockAll is true (custom match mode), all categories are available
export function renderCategories(selectedCategory, unlockAll = false) {
  const unlocks = getUnlocks();

  elements.categoriesGrid.innerHTML = CATEGORIES.map(cat => {
    const isUnlocked = unlockAll || unlocks.includes(cat.id);
    const isSelected = cat.id === selectedCategory;

    return `
      <div class="category-card ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}"
           data-category="${cat.id}"
           ${isUnlocked ? '' : 'disabled'}>
        ${!isUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
        <div class="category-icon">${cat.icon}</div>
        <div class="category-name">${cat.name}</div>
        ${!isUnlocked ? `<div class="category-unlock">Level ${cat.unlockLevel}</div>` : ''}
      </div>
    `;
  }).join('');
}

// Update player inputs based on player count
export function updatePlayerInputs(playerCount) {
  const groups = elements.playerInputs.querySelectorAll('.player-input-group');
  groups.forEach((group, index) => {
    group.style.display = index < playerCount ? 'flex' : 'none';
  });
}

// Get player names from inputs
export function getPlayerNames(playerCount) {
  const names = [];
  for (let i = 1; i <= playerCount; i++) {
    const input = elements.playerInputs.querySelector(`input[data-player="${i}"]`);
    names.push(input?.value.trim() || `Player ${i}`);
  }
  return names;
}

// Render scoreboard
export function renderScoreboard(results, showTotal = false) {
  elements.scoreboard.innerHTML = results.map((player, index) => {
    const isWinner = index === 0;
    return `
      <div class="score-row ${isWinner ? 'winner' : ''}">
        <div class="score-rank">${getRankEmoji(player.rank)}</div>
        <div class="score-player">${escapeHtml(player.name)}</div>
        <div class="score-stats">
          <span class="score-wpm">${showTotal ? player.avgWPM : player.wpm} WPM</span>
          <span class="score-accuracy">${showTotal ? player.avgAccuracy : player.accuracy}%</span>
          <span class="score-total">${showTotal ? player.totalScore : player.score}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Get emoji for rank
function getRankEmoji(rank) {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return rank;
  }
}

// Update results screen
export function updateResults(title, subtitle, xpEarned, xpProgress, isMatchEnd) {
  elements.resultsTitle.textContent = title;
  elements.resultsSubtitle.textContent = subtitle;
  elements.xpEarned.textContent = `+${xpEarned} XP`;
  elements.xpFill.style.width = `${xpProgress}%`;
  elements.btnNextRound.textContent = isMatchEnd ? 'Play Again' : 'Next Round';
}

// Show countdown overlay
export function showCountdown() {
  return new Promise((resolve) => {
    elements.countdownOverlay.classList.add('active');
    let count = 3;
    elements.countdownNumber.textContent = count;

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        elements.countdownNumber.textContent = count;
        // Trigger animation restart
        elements.countdownNumber.style.animation = 'none';
        elements.countdownNumber.offsetHeight; // Trigger reflow
        elements.countdownNumber.style.animation = '';
      } else if (count === 0) {
        elements.countdownNumber.textContent = 'GO!';
      } else {
        clearInterval(interval);
        elements.countdownOverlay.classList.remove('active');
        resolve();
      }
    }, 1000);
  });
}

// Show confetti animation
export function showConfetti() {
  const colors = ['#e94560', '#4ecca3', '#6bcbff', '#ffd93d', '#ff6b6b'];
  const container = elements.confettiContainer;
  container.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(confetti);
  }

  // Clean up after animation
  setTimeout(() => {
    container.innerHTML = '';
  }, 4000);
}

// Focus typing input
export function focusInput() {
  elements.typingInput.focus();
}

// Clear typing input
export function clearInput() {
  elements.typingInput.value = '';
}

// Get typing input value
export function getInputValue() {
  return elements.typingInput.value;
}

// Apply theme
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Sync all theme toggles
  document.querySelectorAll('[id^="theme-switch"]').forEach(toggle => {
    toggle.checked = theme === 'light';
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show/hide game prompt
export function showGamePrompt(show = true) {
  if (elements.gamePrompt) {
    elements.gamePrompt.classList.toggle('hidden', !show);
  }
}

// Set source text
export function setSourceText(source) {
  if (elements.sourceText) {
    elements.sourceText.textContent = source ? `— ${source}` : '';
  }
}

// Show turn complete modal
export function showTurnModal(data) {
  const {
    playerName,
    wpm,
    accuracy,
    time,
    baseScore,
    accuracyBonus,
    timeBonus,
    difficultyMult,
    totalScore,
    xp,
    isLastPlayer,
    isMatchEnd,
    isWinner
  } = data;

  // Set content
  elements.modalIcon.textContent = isWinner ? '🏆' : '✓';
  elements.modalIcon.classList.toggle('winner', isWinner);

  if (isMatchEnd) {
    elements.modalTitle.textContent = isWinner ? 'You Win!' : 'Match Complete!';
    elements.modalSubtitle.textContent = `Final score: ${totalScore.toLocaleString()}`;
  } else if (isLastPlayer) {
    elements.modalTitle.textContent = 'Round Complete!';
    elements.modalSubtitle.textContent = `Great job, ${playerName}!`;
  } else {
    elements.modalTitle.textContent = 'Turn Complete!';
    elements.modalSubtitle.textContent = `Nice work, ${playerName}!`;
  }

  elements.modalWpm.textContent = wpm;
  elements.modalAccuracy.textContent = `${accuracy}%`;
  elements.modalTime.textContent = time;
  elements.modalBaseScore.textContent = baseScore.toLocaleString();
  elements.modalAccuracyBonus.textContent = `+${accuracyBonus}`;
  elements.modalTimeBonus.textContent = `+${timeBonus}`;
  elements.modalDifficultyMult.textContent = `×${difficultyMult}`;
  elements.modalTotalScore.textContent = totalScore.toLocaleString();
  elements.modalXp.textContent = xp;

  // Set button text
  if (isMatchEnd) {
    elements.modalContinueBtn.textContent = 'View Results';
  } else if (isLastPlayer) {
    elements.modalContinueBtn.textContent = 'See Scoreboard';
  } else {
    elements.modalContinueBtn.textContent = 'Next Player';
  }

  elements.modalHint.textContent = 'Press Enter to continue';

  // Show modal
  elements.turnModal.classList.add('active');
}

// Hide turn modal
export function hideTurnModal() {
  elements.turnModal.classList.remove('active');
}

// Check if modal is open
export function isModalOpen() {
  return elements.turnModal?.classList.contains('active');
}

// Export elements for direct access if needed
export function getElements() {
  return elements;
}
