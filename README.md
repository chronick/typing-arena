# TypeRacer Arena

A fun, local multiplayer typing competition game with progression systems, themed content, and polished visuals. Pure HTML/CSS/JS - no frameworks required.

## Features

- **Multiplayer** - 2-4 players, hot-seat turn-based gameplay
- **Multiple Categories** - Literary Classics, Poetry, Code, Random Words, Humor, Modern
- **Difficulty Tiers** - Easy, Medium, Hard, Expert
- **Progression System** - XP, levels (1-50), unlockable content, achievements
- **Dark/Light Theme** - Toggle with persistence
- **Real-time Stats** - WPM, accuracy, progress tracking

## Quick Start

```bash
# Start the game server
make serve

# Open http://localhost:8080 in your browser
```

## Development

```bash
# Run tests (Node.js CLI)
make test-cli

# Run tests (Browser)
make serve-test
# Then open http://localhost:8081

# See all commands
make help
```

## Project Structure

```
typing-arena/
├── src/
│   ├── index.html      # Main entry point
│   ├── css/
│   │   ├── main.css    # Core styles
│   │   └── themes.css  # Dark/light theme variables
│   └── js/
│       ├── app.js      # Main application
│       ├── game.js     # Core game logic
│       ├── ui.js       # UI/DOM manipulation
│       ├── players.js  # Player management
│       ├── levels.js   # Level/progression system
│       ├── content.js  # Text content library
│       └── storage.js  # LocalStorage persistence
├── __tests__/          # Test suite
├── docs/               # Documentation
├── Makefile            # Build commands
└── package.json        # npm configuration
```

## How to Play

1. Enter player names (2-4 players)
2. Choose a game mode:
   - **Quick Play** - Random category & difficulty
   - **Custom Match** - Choose category & difficulty
3. Each player types the same text in turn
4. Scores are calculated based on WPM, accuracy, and time
5. Winner is determined after all rounds

## Scoring

- **Base Score** = WPM × 10
- **Accuracy Bonus** = Accuracy × 2
- **Time Bonus** = max(0, (120 - seconds) × 0.5)
- **Difficulty Multiplier** = Easy (1×), Medium (1.5×), Hard (2×), Expert (3×)

## License

MIT
