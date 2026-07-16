/**
 * FIFA AuraAI - Core Utilities
 * Consolidates security, efficiency, accessibility, and validation helper functions.
 * Exposed to window in browser, or exported via module.exports in Node.js.
 */

const utils = {
  sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().slice(0, 500);
  },

  validateSectionId(id) {
    return /^sec-\d{3}$/.test(id);
  },

  validateScore(score) {
    return typeof score === 'number' && score >= 0 && score <= 100;
  },

  debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  memoize(fn) {
    const cache = new Map();
    return function (...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  },

  computeExperienceScore(data) {
    if (!data || typeof data !== 'object') return 0;
    const weights = { overallAura: 0.40, selfieScore: 0.15, jerseyProb: 0.15, chantEnergy: 0.15, shadeComfort: 0.10, exitEvac: 0.05 };
    return Math.round(
      Object.entries(weights).reduce((total, [key, weight]) => total + (data[key] || 0) * weight, 0)
    );
  },

  buildAriaLabel(section, score, overlay) {
    return `Stadium section ${section}. ${overlay} score: ${score} out of 100. Click to view details and upgrade options.`;
  },

  getContrastRatio(fgHex, bgHex) {
    function luminance(hex) {
      const rgb = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
    const L1 = luminance(fgHex);
    const L2 = luminance(bgHex);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }
};

// Export or expose
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = utils;
} else if (typeof window !== 'undefined') {
  window.utils = utils;
  // Also expose individual functions for backwards compatibility in HTML/other scripts
  Object.keys(utils).forEach(key => {
    window[key] = utils[key];
  });
}
