/**
 * testimonialCarousel.test.js
 * Unit tests + Property-Based tests for the testimonialCarousel module logic.
 * Requirements: 6.3, 6.5
 *
 * The carousel module is an IIFE in app.js and cannot be imported directly.
 * We replicate the pure navigation logic here so tests are self-contained
 * and do not depend on loading the full IIFE bundle — identical approach
 * to contactForm.test.js.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';

// ─── Replicated carousel logic ─────────────────────────────────────────────────
//
// These functions mirror exactly what testimonialCarousel does in app.js.
// If the implementation in app.js changes, these must stay in sync.

const AUTOPLAY_MS = 5000;
const PAUSE_MS    = 10000;

/**
 * Pure index calculation helpers (stateless).
 * These are the core formulas tested by the property tests.
 */
function nextIndex(currentIndex, total) {
  return (currentIndex + 1) % total;
}

function prevIndex(currentIndex, total) {
  return ((currentIndex - 1) % total + total) % total;
}

function goToIndex(index, total) {
  return ((index % total) + total) % total;
}

/**
 * Minimal stateful carousel replica used by unit tests.
 * Holds only what is needed to verify navigate / _pauseAndResume.
 */
function makeCarousel(total, fakeTimers) {
  let _currentIndex = 0;
  let _intervalId   = null;

  function _updateUI() { /* no-op in test environment */ }

  function goTo(index) {
    _currentIndex = goToIndex(index, total);
    _updateUI();
  }

  function _autoPlay() {
    _intervalId = setInterval(function () { goTo(_currentIndex + 1); }, AUTOPLAY_MS);
  }

  function _pauseAndResume() {
    clearInterval(_intervalId);
    _intervalId = null;
    setTimeout(function () { _autoPlay(); }, PAUSE_MS);
  }

  function navigate(dir) {
    if (dir === 'next') {
      goTo(_currentIndex + 1);
    } else {
      goTo(_currentIndex - 1);
    }
    _pauseAndResume();
  }

  // Start auto-play immediately (mirrors init())
  _autoPlay();

  return {
    navigate,
    goTo,
    _autoPlay,
    _pauseAndResume,
    get _currentIndex() { return _currentIndex; },
    get _intervalId()   { return _intervalId; },
  };
}

// ─── Unit tests — navigate() ───────────────────────────────────────────────────

describe('testimonialCarousel — navigate()', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("navigate('next') advances index by 1", () => {
    const c = makeCarousel(3);
    c.navigate('next');
    expect(c._currentIndex).toBe(1);
  });

  it("navigate('next') wraps from last slide back to 0", () => {
    const c = makeCarousel(3);
    c.navigate('next'); // 0 → 1
    c.navigate('next'); // 1 → 2
    c.navigate('next'); // 2 → 0 (wrap)
    expect(c._currentIndex).toBe(0);
  });

  it("navigate('prev') moves index back by 1", () => {
    const c = makeCarousel(3);
    c.navigate('next'); // sit at index 1
    c.navigate('prev'); // back to 0
    expect(c._currentIndex).toBe(0);
  });

  it("navigate('prev') wraps from index 0 to last slide", () => {
    const c = makeCarousel(3);
    c.navigate('prev'); // 0 → 2 (wrap-around)
    expect(c._currentIndex).toBe(2);
  });

  it('index never goes below 0 after multiple prev navigations', () => {
    const c = makeCarousel(5);
    for (let i = 0; i < 10; i++) {
      c.navigate('prev');
      expect(c._currentIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it('index never exceeds total-1 after multiple next navigations', () => {
    const c = makeCarousel(4);
    for (let i = 0; i < 10; i++) {
      c.navigate('next');
      expect(c._currentIndex).toBeLessThan(4);
    }
  });
});

// ─── Unit tests — _pauseAndResume() ───────────────────────────────────────────

describe('testimonialCarousel — _pauseAndResume()', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('clears the active interval immediately on interaction', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const c = makeCarousel(3);
    c.navigate('next');
    expect(clearSpy).toHaveBeenCalled();
  });

  it('_intervalId is null right after _pauseAndResume is called', () => {
    const c = makeCarousel(3);
    c._pauseAndResume();
    // After calling _pauseAndResume the interval is cleared; id should be null
    // (setTimeout hasn't fired yet at this point)
    expect(c._intervalId).toBeNull();
  });

  it('auto-play restarts after 10000ms pause (setTimeout fires)', () => {
    const c = makeCarousel(3);
    c.navigate('next'); // triggers _pauseAndResume
    expect(c._intervalId).toBeNull(); // paused

    vi.advanceTimersByTime(PAUSE_MS); // fast-forward 10 s
    expect(c._intervalId).not.toBeNull(); // auto-play resumed
  });

  it('auto-play does NOT restart before 10000ms have elapsed', () => {
    const c = makeCarousel(3);
    c.navigate('next');
    vi.advanceTimersByTime(PAUSE_MS - 1); // 9999ms — should still be paused
    expect(c._intervalId).toBeNull();
  });

  it('auto-play advances slide every 5000ms after resuming', () => {
    const c = makeCarousel(3);
    // Start at 0, navigate to 1
    c.navigate('next');
    expect(c._currentIndex).toBe(1);

    // Resume auto-play after pause
    vi.advanceTimersByTime(PAUSE_MS);
    expect(c._intervalId).not.toBeNull();

    // Auto-play fires after another 5000ms
    vi.advanceTimersByTime(AUTOPLAY_MS);
    expect(c._currentIndex).toBe(2);
  });
});

// ─── Unit tests — goTo() ──────────────────────────────────────────────────────

describe('testimonialCarousel — goTo()', () => {
  it('jumps directly to the specified index', () => {
    const c = makeCarousel(5);
    c.goTo(3);
    expect(c._currentIndex).toBe(3);
  });

  it('wraps a positive out-of-range index using modulo', () => {
    const c = makeCarousel(3);
    c.goTo(5); // 5 % 3 = 2
    expect(c._currentIndex).toBe(2);
  });

  it('wraps a negative index to a valid positive index', () => {
    const c = makeCarousel(3);
    c.goTo(-1); // ((-1 % 3) + 3) % 3 = 2
    expect(c._currentIndex).toBe(2);
  });
});

// ─── Property-Based Tests ──────────────────────────────────────────────────────

// Feature: unique-simple-website, Property 11: Navigasi Carousel Mempertahankan Index yang Benar

describe('PBT — Property 11: Carousel index always stays in [0, total-1]', () => {
  /**
   * Validates: Requirements 6.3
   *
   * For any (currentIndex, total) pair, pressing next produces
   * (currentIndex + 1) % total, and pressing prev produces
   * (currentIndex - 1 + total) % total.
   * Neither result may be outside [0, total - 1].
   */
  it('navigate next: result equals (currentIndex + 1) % total', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),   // total slides (at least 2)
        fc.integer({ min: 0, max: 19 }),   // currentIndex
        (total, rawIndex) => {
          const currentIndex = rawIndex % total; // ensure index is in range
          const result = nextIndex(currentIndex, total);
          return result === (currentIndex + 1) % total &&
                 result >= 0 &&
                 result < total;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('navigate prev: result equals (currentIndex - 1 + total) % total', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        fc.integer({ min: 0, max: 19 }),
        (total, rawIndex) => {
          const currentIndex = rawIndex % total;
          const result = prevIndex(currentIndex, total);
          return result === (currentIndex - 1 + total) % total &&
                 result >= 0 &&
                 result < total;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('alternating next/prev always keeps index in [0, total-1]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        fc.array(fc.constantFrom('next', 'prev'), { minLength: 1, maxLength: 50 }),
        (total, directions) => {
          let idx = 0;
          for (const dir of directions) {
            idx = dir === 'next' ? nextIndex(idx, total) : prevIndex(idx, total);
            if (idx < 0 || idx >= total) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('goTo with any integer index always stays in [0, total-1]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        fc.integer({ min: -100, max: 100 }),
        (total, index) => {
          const result = goToIndex(index, total);
          return result >= 0 && result < total;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: unique-simple-website, Property 12: Interaksi Carousel Menjeda Auto-Play

describe('PBT — Property 12: User interaction clears interval and resumes after 10000ms', () => {
  /**
   * Validates: Requirements 6.5
   *
   * For any number of navigation clicks, after each click:
   *   - The existing intervalId is cleared (interval is null immediately after).
   *   - After 10000ms, auto-play resumes (intervalId is non-null again).
   */
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('after any navigate call, intervalId is null before timeout fires', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        fc.array(fc.constantFrom('next', 'prev'), { minLength: 1, maxLength: 20 }),
        (total, directions) => {
          vi.clearAllTimers();
          const c = makeCarousel(total);
          for (const dir of directions) {
            c.navigate(dir);
          }
          // After the last interaction, interval is paused (null) until timeout
          return c._intervalId === null;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('after navigate + 10000ms, auto-play always resumes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        fc.constantFrom('next', 'prev'),
        (total, dir) => {
          vi.clearAllTimers();
          const c = makeCarousel(total);
          c.navigate(dir);
          expect(c._intervalId).toBeNull();   // paused
          vi.advanceTimersByTime(PAUSE_MS);
          return c._intervalId !== null;       // resumed
        }
      ),
      { numRuns: 50 }
    );
  });
});
