// VVER1000Utils.js - Helper functions for the VVER-1000 simulator

/**
 * Format simulation time in HH:MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Common chart options for all simulation charts
 */
export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Time'
      },
      ticks: {
        maxTicksLimit: 8,
        maxRotation: 0
      }
    },
    y: {
      title: {
        display: true,
        text: 'Value'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    }
  },
  animation: {
    duration: 0 // Disable animations for better performance
  },
  elements: {
    point: {
      radius: 0, // Hide points for smoother lines
      hitRadius: 10 // But keep them detectable for tooltips
    },
    line: {
      tension: 0.4 // Smoother curves
    }
  }
};

/**
 * Prepare chart data from history arrays
 * @param {Array} history - Array of history data points
 * @param {string} label - Label for the chart
 * @param {string} color - Color for the chart line
 * @returns {Object} Formatted chart data object
 */
export const prepareChartData = (history, label, color) => {
  return {
    labels: history.map(p => formatTime(p.time)),
    datasets: [
      {
        label,
        data: history.map(p => p.value),
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency
        tension: 0.4,
        fill: true
      }
    ]
  };
};

/**
 * Creates random variations for more realistic simulation
 * @param {number} baseValue - The base value
 * @param {number} variation - Maximum percentage variation
 * @returns {number} Value with random variation
 */
export const addRandomVariation = (baseValue, variation = 0.005) => {
  const randomFactor = 1 + (Math.random() - 0.5) * variation * 2;
  return baseValue * randomFactor;
};

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));