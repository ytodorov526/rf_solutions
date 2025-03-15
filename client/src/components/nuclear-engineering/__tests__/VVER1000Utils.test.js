// VVER1000Utils.test.js - Unit tests for the VVER-1000 utility functions
import { formatTime, prepareChartData, addRandomVariation, clamp } from '../VVER1000Utils';

describe('VVER1000Utils', () => {
  // Test formatTime function
  describe('formatTime', () => {
    test('should format 0 seconds correctly', () => {
      expect(formatTime(0)).toBe('00:00:00');
    });
    
    test('should format seconds correctly', () => {
      expect(formatTime(45)).toBe('00:00:45');
    });
    
    test('should format minutes and seconds correctly', () => {
      expect(formatTime(185)).toBe('00:03:05');
    });
    
    test('should format hours, minutes and seconds correctly', () => {
      expect(formatTime(3672)).toBe('01:01:12');
    });
    
    test('should handle large time values', () => {
      expect(formatTime(86399)).toBe('23:59:59');
    });
  });
  
  // Test prepareChartData function
  describe('prepareChartData', () => {
    test('should prepare chart data correctly', () => {
      // Create test history data
      const history = [
        { time: 0, value: 10 },
        { time: 60, value: 20 },
        { time: 120, value: 30 }
      ];
      
      // Prepare chart data
      const chartData = prepareChartData(history, 'Test Label', 'rgba(255, 0, 0, 1)');
      
      // Check structure
      expect(chartData.labels).toEqual(['00:00:00', '00:01:00', '00:02:00']);
      expect(chartData.datasets.length).toBe(1);
      expect(chartData.datasets[0].label).toBe('Test Label');
      expect(chartData.datasets[0].data).toEqual([10, 20, 30]);
      expect(chartData.datasets[0].borderColor).toBe('rgba(255, 0, 0, 1)');
    });
    
    test('should handle empty history', () => {
      // Prepare chart data with empty history
      const chartData = prepareChartData([], 'Test Label', 'rgba(255, 0, 0, 1)');
      
      // Check structure
      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets[0].data).toEqual([]);
    });
  });
  
  // Test addRandomVariation function
  describe('addRandomVariation', () => {
    test('should add random variation within expected range', () => {
      // Mock Math.random to return consistent values
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5); // Middle value
      
      // Base value
      const baseValue = 100;
      const variation = 0.1; // 10%
      
      // With Math.random() = 0.5, we should get exactly baseValue
      expect(addRandomVariation(baseValue, variation)).toBe(baseValue);
      
      // Change Math.random to return high value
      Math.random = jest.fn().mockReturnValue(1);
      
      // Should be baseValue + variation%
      expect(addRandomVariation(baseValue, variation)).toBe(baseValue * 1.1);
      
      // Change Math.random to return low value
      Math.random = jest.fn().mockReturnValue(0);
      
      // Should be baseValue - variation%
      expect(addRandomVariation(baseValue, variation)).toBe(baseValue * 0.9);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
    
    test('should use default variation if not specified', () => {
      // Mock Math.random to return consistent values
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5); // Middle value
      
      // Base value
      const baseValue = 100;
      
      // With Math.random() = 0.5, we should get exactly baseValue
      expect(addRandomVariation(baseValue)).toBe(baseValue);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
  });
  
  // Test clamp function
  describe('clamp', () => {
    test('should clamp values within the specified range', () => {
      // Value within range
      expect(clamp(5, 0, 10)).toBe(5);
      
      // Value below minimum
      expect(clamp(-5, 0, 10)).toBe(0);
      
      // Value above maximum
      expect(clamp(15, 0, 10)).toBe(10);
      
      // Edge cases
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });
});