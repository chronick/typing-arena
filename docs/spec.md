# TypeRacer Arena - Specification

## Overview
TypeRacer Arena is a local multiplayer typing competition game featuring themed content stages, difficulty progression, and an XP-based unlock system. Built with pure HTML/CSS/JS.

## Game Modes

### Quick Play
- 1-4 players
- Random text from unlocked categories
- Single round, immediate results

### Campaign Mode
- Progress through 6 themed stages
- Each stage has 5 levels of increasing difficulty
- Complete stages to unlock the next
- Earn XP and achievements

### Custom Match
- Choose: category, difficulty, number of rounds
- 2-4 players
- Best of 3/5/7 format

## Multiplayer System

### Hot-Seat (Same Device)
1. Players enter names (2-4 players)
2. Each player takes a turn typing the same text
3. Scores calculated: WPM + accuracy bonus
4. Scoreboard shown after each round
5. Winner determined by total score across rounds

### Scoring Formula
```
base_score = wpm * 10
accuracy_bonus = accuracy_percent * 2
time_bonus = max(0, (time_limit - elapsed_time)) * 0.5
total_score = base_score + accuracy_bonus + time_bonus
```

## Content Categories

### Stage 1: Literary Classics
Famous opening lines and excerpts:
- Pride and Prejudice (Austen)
- A Tale of Two Cities (Dickens)
- Moby Dick (Melville)
- Romeo and Juliet (Shakespeare)
- The Great Gatsby (Fitzgerald)

### Stage 2: Poetry
Classic poems and verses:
- The Road Not Taken (Frost)
- The Raven (Poe)
- Hope is the Thing with Feathers (Dickinson)
- Sonnet 18 (Shakespeare)
- If— (Kipling)

### Stage 3: Code
Famous algorithms and snippets:
- FizzBuzz
- Binary Search
- Quicksort
- Hello World (various languages)
- Fibonacci sequence

### Stage 4: Random Words
Procedurally generated word sequences:
- Common words (easy)
- Mixed vocabulary (medium)
- Technical terms (hard)
- Rare words (expert)

### Stage 5: Humor
Fun and challenging phrases:
- Tongue twisters
- Famous movie quotes
- Internet memes (text-based)
- Absurdist phrases
- Puns and wordplay

### Stage 6: Modern (Unlockable)
Contemporary text styles:
- News headlines
- Tech blog excerpts
- Social media posts
- Scientific abstracts

## Difficulty Tiers

| Tier | Word Count | Characteristics |
|------|------------|-----------------|
| Easy | 20-40 | Common words, simple punctuation |
| Medium | 40-80 | Varied vocabulary, standard punctuation |
| Hard | 80-120 | Complex words, numbers, symbols |
| Expert | 120+ | Code syntax, archaic language, special chars |

## Progression System

### XP Calculation
```
xp_earned = (wpm * accuracy_percent / 100) * difficulty_multiplier
difficulty_multiplier: Easy=1, Medium=1.5, Hard=2, Expert=3
```

### Player Levels (1-50)
- Level up every 1000 XP
- Each level unlocks cosmetic rewards
- Level milestones unlock new content

### Unlocks
- Stage 2 (Poetry): Reach Level 3
- Stage 3 (Code): Reach Level 5
- Stage 4 (Random): Reach Level 8
- Stage 5 (Humor): Reach Level 12
- Stage 6 (Modern): Complete all other stages

### Achievements
- **First Steps**: Complete your first round
- **Speed Demon**: 80+ WPM
- **100 WPM Club**: 100+ WPM
- **Perfectionist**: 100% accuracy
- **Marathon**: 10 rounds in one session
- **Scholar**: Complete all Literary Classics
- **Poet**: Complete all Poetry
- **Hacker**: Complete all Code challenges
- **Comedian**: Complete all Humor
- **Completionist**: Unlock all content

## UI/UX Specifications

### Screens
1. **Title Screen**: Logo, Start button, Settings
2. **Player Setup**: Enter names, choose mode
3. **Category Select**: Visual stage selection (Campaign)
4. **Game Screen**: Typing area, stats, progress
5. **Results Screen**: Scores, XP gained, next round
6. **Leaderboard**: High scores per category

### Typing Interface
- Source text displayed above input area
- Characters highlight as typed:
  - Correct: green
  - Incorrect: red with shake animation
  - Current: blinking cursor
- Real-time stats: WPM, accuracy, time elapsed
- Progress bar showing completion percentage

### Theme System
**Dark Theme (default)**
- Background: #1a1a2e
- Surface: #16213e
- Primary: #e94560
- Secondary: #0f3460
- Text: #eaeaea
- Success: #4ecca3
- Error: #ff6b6b

**Light Theme**
- Background: #f5f5f5
- Surface: #ffffff
- Primary: #e94560
- Secondary: #3498db
- Text: #2c3e50
- Success: #27ae60
- Error: #e74c3c

### Animations
- Page transitions: slide/fade
- Character typing: subtle pop
- Correct streak: glow effect
- Round complete: confetti burst
- Level up: celebration animation

## Technical Requirements

### Browser Support
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Local Storage Schema
```javascript
{
  "typeracer_players": [
    { "name": "Player1", "xp": 5000, "level": 5, "achievements": [...] }
  ],
  "typeracer_unlocks": ["stage_1", "stage_2", ...],
  "typeracer_highscores": { "classics": 150, "poetry": 120, ... },
  "typeracer_theme": "dark",
  "typeracer_sound": true
}
```

### Performance Targets
- First paint: < 500ms
- Input latency: < 16ms
- Smooth 60fps animations

## File Structure
```
src/
├── index.html          # Single page app shell
├── css/
│   ├── main.css        # Layout, components
│   └── themes.css      # CSS custom properties for themes
└── js/
    ├── app.js          # Entry point, routing
    ├── game.js         # Core typing mechanics
    ├── ui.js           # DOM manipulation, animations
    ├── players.js      # Player state management
    ├── levels.js       # Progression, unlocks
    ├── content.js      # Text library
    └── storage.js      # LocalStorage wrapper
```
