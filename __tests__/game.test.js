// Game Logic Tests

import { describe, test, assert, assertEqual, assertInRange, logger } from './tests.js';

// Mock TypingGame class for testing
class MockTypingGame {
  constructor() {
    this.targetText = '';
    this.typedText = '';
    this.startTime = null;
    this.endTime = null;
    this.isActive = false;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.currentIndex = 0;
    this.backspaceMode = 'allowed';
    this.previousInputLength = 0;
  }

  init(text) {
    this.targetText = text;
    this.typedText = '';
    this.startTime = null;
    this.endTime = null;
    this.isActive = false;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.currentIndex = 0;
    this.previousInputLength = 0;
  }

  setBackspaceMode(mode) {
    this.backspaceMode = mode;
  }

  start() {
    this.isActive = true;
    this.startTime = Date.now();
  }

  processInput(inputText) {
    if (!this.startTime && inputText.length > 0) {
      this.start();
    }
    if (!this.isActive) return inputText;

    // Enforce backspace mode
    if (this.backspaceMode === 'disabled' && inputText.length < this.previousInputLength) {
      return this.typedText;
    }

    this.previousInputLength = inputText.length;
    this.typedText = inputText;
    this.currentIndex = inputText.length;
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

    // Complete when length matches (errors allowed)
    if (inputText.length >= this.targetText.length) {
      this.complete();
    }

    return inputText;
  }

  complete() {
    this.isActive = false;
    this.endTime = Date.now();
  }

  calculateWPM(chars, seconds) {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const words = chars / 5;
    return words / minutes;
  }

  calculateAccuracy() {
    const totalTyped = this.correctChars + this.incorrectChars;
    if (totalTyped === 0) return 100;
    return (this.correctChars / totalTyped) * 100;
  }

  calculateProgress() {
    if (this.targetText.length === 0) return 0;
    return Math.min((this.currentIndex / this.targetText.length) * 100, 100);
  }

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
}

export function gameTests() {
  describe('Game - Initialization', () => {
    test('init() resets all state', () => {
      const game = new MockTypingGame();
      game.init('Hello World');
      logger.debug('init()', { targetText: game.targetText, typedText: game.typedText, isActive: game.isActive });
      assertEqual(game.targetText, 'Hello World');
      assertEqual(game.typedText, '');
      assertEqual(game.isActive, false);
      assertEqual(game.correctChars, 0);
      assertEqual(game.incorrectChars, 0);
    });

    test('init() with empty string', () => {
      const game = new MockTypingGame();
      game.init('');
      logger.debug('init("")', { targetText: game.targetText, progress: game.calculateProgress() });
      assertEqual(game.targetText, '');
      assertEqual(game.calculateProgress(), 0);
    });
  });

  describe('Game - Input Processing', () => {
    test('processInput() starts game on first keystroke', () => {
      const game = new MockTypingGame();
      game.init('test');
      assertEqual(game.isActive, false);
      game.processInput('t');
      logger.debug('processInput("t")', { isActive: game.isActive, startTime: game.startTime });
      assertEqual(game.isActive, true);
      assert(game.startTime !== null, 'startTime should be set');
    });

    test('processInput() counts correct characters', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.processInput('hel');
      logger.debug('processInput("hel")', { target: 'hello', correctChars: game.correctChars, incorrectChars: game.incorrectChars });
      assertEqual(game.correctChars, 3);
      assertEqual(game.incorrectChars, 0);
    });

    test('processInput() counts incorrect characters', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.processInput('hxllo');
      logger.debug('processInput("hxllo")', { target: 'hello', correctChars: game.correctChars, incorrectChars: game.incorrectChars });
      assertEqual(game.correctChars, 4);
      assertEqual(game.incorrectChars, 1);
    });

    test('processInput() handles all wrong input', () => {
      const game = new MockTypingGame();
      game.init('abc');
      game.processInput('xyz');
      logger.debug('processInput("xyz")', { target: 'abc', correctChars: game.correctChars, incorrectChars: game.incorrectChars });
      assertEqual(game.correctChars, 0);
      assertEqual(game.incorrectChars, 3);
    });

    test('processInput() completes game when text matches', () => {
      const game = new MockTypingGame();
      game.init('hi');
      game.processInput('hi');
      logger.debug('processInput("hi")', { target: 'hi', isActive: game.isActive, endTime: game.endTime });
      assertEqual(game.isActive, false);
      assert(game.endTime !== null, 'endTime should be set');
    });
  });

  describe('Game - WPM Calculation', () => {
    test('calculateWPM() returns 0 for 0 seconds', () => {
      const game = new MockTypingGame();
      const result = game.calculateWPM(50, 0);
      logger.debug('calculateWPM(50, 0)', { result });
      assertEqual(result, 0);
    });

    test('calculateWPM() calculates correctly', () => {
      const game = new MockTypingGame();
      const result = game.calculateWPM(50, 60);
      logger.debug('calculateWPM(50, 60)', { chars: 50, seconds: 60, words: 10, result });
      assertEqual(result, 10);
    });

    test('calculateWPM() for 30 seconds', () => {
      const game = new MockTypingGame();
      const result = game.calculateWPM(25, 30);
      logger.debug('calculateWPM(25, 30)', { chars: 25, seconds: 30, words: 5, result });
      assertEqual(result, 10);
    });

    test('calculateWPM() high speed typing', () => {
      const game = new MockTypingGame();
      const result = game.calculateWPM(500, 60);
      logger.debug('calculateWPM(500, 60)', { chars: 500, seconds: 60, words: 100, result });
      assertEqual(result, 100);
    });
  });

  describe('Game - Accuracy Calculation', () => {
    test('calculateAccuracy() returns 100 for no input', () => {
      const game = new MockTypingGame();
      game.init('test');
      const result = game.calculateAccuracy();
      logger.debug('calculateAccuracy() no input', { correctChars: game.correctChars, incorrectChars: game.incorrectChars, result });
      assertEqual(result, 100);
    });

    test('calculateAccuracy() 100% for perfect typing', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.processInput('hello');
      const result = game.calculateAccuracy();
      logger.debug('calculateAccuracy() perfect', { correctChars: game.correctChars, incorrectChars: game.incorrectChars, result });
      assertEqual(result, 100);
    });

    test('calculateAccuracy() 50% for half correct', () => {
      const game = new MockTypingGame();
      game.init('abcd');
      game.processInput('abxx');
      const result = game.calculateAccuracy();
      logger.debug('calculateAccuracy() half', { correctChars: game.correctChars, incorrectChars: game.incorrectChars, result });
      assertEqual(result, 50);
    });

    test('calculateAccuracy() 0% for all wrong', () => {
      const game = new MockTypingGame();
      game.init('abc');
      game.processInput('xyz');
      const result = game.calculateAccuracy();
      logger.debug('calculateAccuracy() all wrong', { correctChars: game.correctChars, incorrectChars: game.incorrectChars, result });
      assertEqual(result, 0);
    });
  });

  describe('Game - Progress Calculation', () => {
    test('calculateProgress() 0% at start', () => {
      const game = new MockTypingGame();
      game.init('hello');
      const result = game.calculateProgress();
      logger.debug('calculateProgress() start', { currentIndex: game.currentIndex, targetLen: game.targetText.length, result });
      assertEqual(result, 0);
    });

    test('calculateProgress() 50% halfway', () => {
      const game = new MockTypingGame();
      game.init('test');
      game.processInput('te');
      const result = game.calculateProgress();
      logger.debug('calculateProgress() halfway', { currentIndex: game.currentIndex, targetLen: game.targetText.length, result });
      assertEqual(result, 50);
    });

    test('calculateProgress() 100% at end', () => {
      const game = new MockTypingGame();
      game.init('test');
      game.processInput('test');
      const result = game.calculateProgress();
      logger.debug('calculateProgress() end', { currentIndex: game.currentIndex, targetLen: game.targetText.length, result });
      assertEqual(result, 100);
    });

    test('calculateProgress() caps at 100%', () => {
      const game = new MockTypingGame();
      game.init('hi');
      game.currentIndex = 10;
      const result = game.calculateProgress();
      logger.debug('calculateProgress() overflow', { currentIndex: game.currentIndex, targetLen: game.targetText.length, result });
      assertInRange(result, 0, 100);
    });
  });

  describe('Game - Character States', () => {
    test('getCharacterStates() all untyped at start', () => {
      const game = new MockTypingGame();
      game.init('abc');
      const states = game.getCharacterStates();
      logger.debug('getCharacterStates() start', { states: states.map(s => s.state) });
      assertEqual(states[0].state, 'current');
      assertEqual(states[1].state, 'untyped');
      assertEqual(states[2].state, 'untyped');
    });

    test('getCharacterStates() marks correct chars', () => {
      const game = new MockTypingGame();
      game.init('abc');
      game.processInput('ab');
      const states = game.getCharacterStates();
      logger.debug('getCharacterStates() correct', { input: 'ab', states: states.map(s => s.state) });
      assertEqual(states[0].state, 'correct');
      assertEqual(states[1].state, 'correct');
      assertEqual(states[2].state, 'current');
    });

    test('getCharacterStates() marks incorrect chars', () => {
      const game = new MockTypingGame();
      game.init('abc');
      game.processInput('aX');
      const states = game.getCharacterStates();
      logger.debug('getCharacterStates() incorrect', { input: 'aX', states: states.map(s => s.state) });
      assertEqual(states[0].state, 'correct');
      assertEqual(states[1].state, 'incorrect');
      assertEqual(states[2].state, 'current');
    });
  });

  describe('Game - Errors Allowed', () => {
    test('game completes even with errors', () => {
      const game = new MockTypingGame();
      game.init('abc');
      game.processInput('aXc');
      logger.debug('completes with errors', { input: 'aXc', target: 'abc', isActive: game.isActive });
      assertEqual(game.isActive, false, 'Game should complete even with errors');
      assertEqual(game.incorrectChars, 1);
    });

    test('game completes with all wrong characters', () => {
      const game = new MockTypingGame();
      game.init('abc');
      game.processInput('xyz');
      logger.debug('completes all wrong', { input: 'xyz', target: 'abc', isActive: game.isActive });
      assertEqual(game.isActive, false, 'Game should complete even with all errors');
      assertEqual(game.incorrectChars, 3);
      assertEqual(game.calculateAccuracy(), 0);
    });

    test('incorrect chars are tracked properly', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.processInput('hXllX');
      logger.debug('error tracking', { correctChars: game.correctChars, incorrectChars: game.incorrectChars });
      assertEqual(game.correctChars, 3, 'Should have 3 correct chars');
      assertEqual(game.incorrectChars, 2, 'Should have 2 incorrect chars');
    });
  });

  describe('Game - Backspace Mode', () => {
    test('setBackspaceMode() changes mode', () => {
      const game = new MockTypingGame();
      assertEqual(game.backspaceMode, 'allowed');
      game.setBackspaceMode('disabled');
      assertEqual(game.backspaceMode, 'disabled');
    });

    test('backspace allowed by default', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.processInput('hel');
      const result = game.processInput('he');
      logger.debug('backspace allowed', { before: 'hel', after: result, typedText: game.typedText });
      assertEqual(game.typedText, 'he', 'Backspace should work by default');
    });

    test('backspace disabled blocks deletion', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.setBackspaceMode('disabled');
      game.processInput('hel');
      const result = game.processInput('he');
      logger.debug('backspace disabled', { before: 'hel', attempted: 'he', result, typedText: game.typedText });
      assertEqual(result, 'hel', 'Should return previous text when backspace blocked');
      assertEqual(game.typedText, 'hel', 'typedText should not change');
    });

    test('backspace disabled allows forward typing', () => {
      const game = new MockTypingGame();
      game.init('hello');
      game.setBackspaceMode('disabled');
      game.processInput('hel');
      game.processInput('hell');
      logger.debug('forward typing allowed', { typedText: game.typedText, currentIndex: game.currentIndex });
      assertEqual(game.typedText, 'hell', 'Forward typing should still work');
    });

    test('backspace disabled does not affect new game', () => {
      const game = new MockTypingGame();
      game.init('test');
      game.setBackspaceMode('disabled');
      game.processInput('te');
      game.init('new'); // Reset game
      assertEqual(game.previousInputLength, 0, 'previousInputLength should reset');
      game.processInput('n');
      assertEqual(game.typedText, 'n', 'First character should work');
    });
  });
}
