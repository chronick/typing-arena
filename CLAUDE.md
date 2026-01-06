# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

TypeRacer Arena is a local multiplayer typing competition game built with pure HTML/CSS/JS (no frameworks). Players take turns typing the same text, competing on WPM and accuracy.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), CSS custom properties
- **Storage**: LocalStorage for persistence
- **Server**: Python `http.server` (development only)
- **Tests**: Custom test framework (browser + Node.js CLI)
- **Deployment**: GitHub Pages via GitHub Actions

## Common Commands

```bash
# Start game server (port 8080)
make serve

# Run tests (CLI)
make test-cli

# Run tests (browser)
make serve-test
# Then open http://localhost:8081

# Run tests with JSON output
make test-cli-json
```

## Project Structure

```
typing-arena/
├── src/                    # Main application
│   ├── index.html          # Entry point
│   ├── css/
│   │   ├── main.css        # Core styles
│   │   └── themes.css      # Theme variables
│   └── js/
│       ├── app.js          # Main app, event handling
│       ├── game.js         # Core typing game logic
│       ├── ui.js           # DOM manipulation
│       ├── players.js      # Multiplayer turn management
│       ├── levels.js       # XP, scoring, achievements
│       ├── content.js      # Text content library
│       └── storage.js      # LocalStorage wrapper
├── __tests__/              # Test suite
│   ├── tests.js            # Test framework + logger
│   ├── *.test.js           # Unit tests
│   ├── run-tests.js        # Node.js CLI runner
│   └── index.html          # Browser test runner
├── docs/
│   └── spec.md             # Full specification
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
├── Makefile                # Build commands
└── package.json            # npm scripts
```

## Key Patterns

### ES6 Modules
All JS files use native ES6 modules. Import/export syntax:
```javascript
import { typingGame } from './game.js';
export function calculateScore() { ... }
```

### Game Flow
1. `app.js` handles navigation and orchestrates game flow
2. `game.js` manages typing state, WPM/accuracy calculation
3. `players.js` handles turn rotation and scoring
4. `ui.js` updates DOM based on game state

### Testing
- Tests use a custom lightweight framework in `tests.js`
- Logger available: `logger.debug()`, `logger.info()`, `logger.warn()`, `logger.error()`
- Run `make test-cli` before committing

### Scoring Formula
```javascript
baseScore = wpm * 10
accuracyBonus = accuracy * 2
timeBonus = max(0, (120 - seconds) * 0.5)
totalScore = (baseScore + accuracyBonus + timeBonus) * difficultyMultiplier
```

## URLs

- **Live**: https://chronick.github.io/typing-arena/
- **Tests**: https://chronick.github.io/typing-arena/__tests__/
- **Repo**: https://github.com/chronick/typing-arena
