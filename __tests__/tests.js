// TypeRacer Arena - Test Suite
// Run with: make test-server, then curl http://localhost:8081/api/tests

import { gameTests } from './game.test.js';
import { levelsTests } from './levels.test.js';
import { playersTests } from './players.test.js';
import { storageTests } from './storage.test.js';
import { integrationTests } from './integration.test.js';

// Logger with levels
const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
let currentLogLevel = LOG_LEVELS.debug;

export const logger = {
  setLevel(level) {
    currentLogLevel = LOG_LEVELS[level] ?? LOG_LEVELS.info;
  },

  debug(...args) {
    if (currentLogLevel <= LOG_LEVELS.debug) {
      console.log('%c[DEBUG]', 'color: #888', ...args);
    }
  },

  info(...args) {
    if (currentLogLevel <= LOG_LEVELS.info) {
      console.log('%c[INFO]', 'color: #4a9eff', ...args);
    }
  },

  warn(...args) {
    if (currentLogLevel <= LOG_LEVELS.warn) {
      console.warn('%c[WARN]', 'color: #f5a623', ...args);
    }
  },

  error(...args) {
    if (currentLogLevel <= LOG_LEVELS.error) {
      console.error('%c[ERROR]', 'color: #ff4757', ...args);
    }
  },

  // Log test data with structured output
  test(name, data) {
    if (currentLogLevel <= LOG_LEVELS.debug) {
      console.groupCollapsed(`%c[TEST] ${name}`, 'color: #2ed573');
      console.table(data);
      console.groupEnd();
    }
  }
};

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  describe(group, fn) {
    this.currentGroup = group;
    fn();
    this.currentGroup = null;
  }

  test(name, fn) {
    this.tests.push({
      name,
      group: this.currentGroup,
      fn
    });
  }

  async run() {
    const startTime = Date.now();
    this.results = [];

    for (const test of this.tests) {
      try {
        await test.fn();
        this.results.push({
          name: test.name,
          group: test.group,
          passed: true
        });
      } catch (error) {
        this.results.push({
          name: test.name,
          group: test.group,
          passed: false,
          error: error.message
        });
      }
    }

    const duration = Date.now() - startTime;
    const passed = this.results.every(r => r.passed);

    return {
      passed,
      duration,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.passed).length,
        failed: this.results.filter(r => !r.passed).length
      },
      tests: this.results
    };
  }
}

// Assertions
export function assert(condition, message = 'Assertion failed') {
  if (!condition) throw new Error(message);
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

export function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Objects not equal:\nExpected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(actual)}`);
  }
}

export function assertThrows(fn, message = 'Expected function to throw') {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error(message);
}

export function assertInRange(value, min, max, message) {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be between ${min} and ${max}`);
  }
}

// Create global runner
const runner = new TestRunner();

export function describe(group, fn) {
  runner.describe(group, fn);
}

export function test(name, fn) {
  runner.test(name, fn);
}

// Run all tests
export async function runAllTests() {
  // Register all test suites
  gameTests();
  levelsTests();
  playersTests();
  storageTests();
  integrationTests();

  // Run tests
  return await runner.run();
}

// API endpoint handler (for curl)
export function getTestResultsJSON() {
  return runAllTests();
}
