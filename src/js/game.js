// TypeRacer Arena - Core Game Logic

export class TypingGame {
  constructor() {
    this.targetText = '';
    this.typedText = '';
    this.startTime = null;
    this.endTime = null;
    this.isActive = false;
    this.onUpdate = null;
    this.onComplete = null;
    this.onError = null;

    // Stats
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.currentIndex = 0;

    // Timer
    this.timerInterval = null;
    this.elapsedTime = 0;

    // Settings
    this.backspaceMode = 'allowed'; // 'allowed' or 'disabled'
    this.previousInputLength = 0; // Track previous input length for backspace detection
  }

  // Initialize game with target text
  init(text) {
    this.targetText = text;
    this.typedText = '';
    this.startTime = null;
    this.endTime = null;
    this.isActive = false;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.currentIndex = 0;
    this.elapsedTime = 0;
    this.previousInputLength = 0;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Set backspace mode ('allowed' or 'disabled')
  setBackspaceMode(mode) {
    this.backspaceMode = mode;
  }

  // Start the game
  start() {
    console.log('Game started!');
    this.isActive = true;
    this.startTime = Date.now();

    // Start timer
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.onUpdate) {
        this.onUpdate(this.getStats());
      }
    }, 100);
  }

  // Process a keystroke
  // Returns the text that should be in the input (for backspace enforcement)
  processInput(inputText) {
    // Start timer on first keystroke
    if (!this.startTime && inputText.length > 0) {
      this.start();
    }

    if (!this.isActive) return inputText;

    // Enforce backspace mode - if disabled and input got shorter, restore previous length
    if (this.backspaceMode === 'disabled' && inputText.length < this.previousInputLength) {
      // Return the previous typed text to restore it
      return this.typedText;
    }

    this.previousInputLength = inputText.length;
    this.typedText = inputText;
    this.currentIndex = inputText.length;

    // Calculate correct/incorrect characters
    this.correctChars = 0;
    this.incorrectChars = 0;

    for (let i = 0; i < inputText.length; i++) {
      if (i < this.targetText.length) {
        if (inputText[i] === this.targetText[i]) {
          this.correctChars++;
        } else {
          this.incorrectChars++;
        }
      }
    }

    // Check for error (current character is wrong)
    const hasError = inputText.length > 0 &&
      inputText[inputText.length - 1] !== this.targetText[inputText.length - 1];

    if (hasError && this.onError) {
      this.onError();
    }

    // Update stats
    if (this.onUpdate) {
      this.onUpdate(this.getStats());
    }

    // Check for completion - complete when typed length matches target (errors allowed)
    if (inputText.length >= this.targetText.length) {
      console.log('Completion:', {
        inputLen: inputText.length,
        targetLen: this.targetText.length,
        correctChars: this.correctChars,
        incorrectChars: this.incorrectChars,
        accuracy: this.calculateAccuracy()
      });
      this.complete();
    }

    return inputText;
  }

  // Complete the game
  complete() {
    console.log('Game complete!');
    this.isActive = false;
    this.endTime = Date.now();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.onComplete) {
      this.onComplete(this.getFinalStats());
    }
  }

  // Get current stats
  getStats() {
    const timeSeconds = this.startTime
      ? (Date.now() - this.startTime) / 1000
      : 0;

    const wpm = this.calculateWPM(this.correctChars, timeSeconds);
    const accuracy = this.calculateAccuracy();
    const progress = this.calculateProgress();

    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      progress,
      elapsedTime: this.elapsedTime,
      formattedTime: this.formatTime(this.elapsedTime),
      currentIndex: this.currentIndex,
      totalChars: this.targetText.length,
      correctChars: this.correctChars,
      incorrectChars: this.incorrectChars
    };
  }

  // Get final stats after completion
  getFinalStats() {
    const timeSeconds = (this.endTime - this.startTime) / 1000;
    const wpm = this.calculateWPM(this.correctChars, timeSeconds);
    const accuracy = this.calculateAccuracy();

    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      timeSeconds: Math.round(timeSeconds),
      formattedTime: this.formatTime(Math.round(timeSeconds)),
      correctChars: this.correctChars,
      incorrectChars: this.incorrectChars,
      totalChars: this.targetText.length,
      wordsTyped: this.targetText.split(/\s+/).length
    };
  }

  // Calculate WPM (words per minute)
  // Standard: 5 characters = 1 word
  calculateWPM(chars, seconds) {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const words = chars / 5;
    return words / minutes;
  }

  // Calculate accuracy percentage
  calculateAccuracy() {
    const totalTyped = this.correctChars + this.incorrectChars;
    if (totalTyped === 0) return 100;
    return (this.correctChars / totalTyped) * 100;
  }

  // Calculate progress percentage
  calculateProgress() {
    if (this.targetText.length === 0) return 0;
    return Math.min((this.currentIndex / this.targetText.length) * 100, 100);
  }

  // Format time as M:SS
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Get character states for display
  getCharacterStates() {
    return this.targetText.split('').map((char, index) => {
      if (index < this.typedText.length) {
        if (this.typedText[index] === char) {
          return { char, state: 'correct' };
        } else {
          return { char, state: 'incorrect' };
        }
      } else if (index === this.typedText.length) {
        return { char, state: 'current' };
      } else {
        return { char, state: 'untyped' };
      }
    });
  }

  // Reset the game
  reset() {
    this.init(this.targetText);
  }

  // Cleanup
  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

// Export singleton instance
export const typingGame = new TypingGame();
