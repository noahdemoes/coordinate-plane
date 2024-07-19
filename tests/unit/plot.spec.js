// tests/unit/plot.spec.js
import { getRandomNonZero, calculateSlopeAndIntercept } from '../../src/utils/plot.js';

describe('plot.js functions', () => {
  describe('getRandomNonZero', () => {
    it('returns a non-zero number within the range', () => {
      const min = -5;
      const max = 5;
      const result = getRandomNonZero(min, max);
      expect(result).not.toBe(0);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });

  describe('calculateSlopeAndIntercept', () => {
    it('calculates the correct slope and y-intercept', () => {
      const points = [{ x: 1, y: 2 }, { x: 3, y: 8 }];
      const { slope, yIntercept } = calculateSlopeAndIntercept(points);
      expect(slope).toBe(3);
      expect(yIntercept).toBe(-1);
    });

    it('returns Infinity for vertical lines', () => {
      const points = [{ x: 2, y: 2 }, { x: 2, y: 8 }];
      const { slope, yIntercept } = calculateSlopeAndIntercept(points);
      expect(slope).toBe(Infinity);
      expect(yIntercept).toBeNull();
    });
  });

  // Additional tests for other functions
});
